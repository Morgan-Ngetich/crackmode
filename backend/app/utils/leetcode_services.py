"""
LeetCode API service.

All outbound HTTP calls go through `_get()`, which acquires a slot from
the shared rate limiter before firing.  This ensures that every code path
(daily sync, manual sync, setup) counts against the same 90-call/hour budget.

Primary sync path: get_sync_data()
  - Exactly 2 API calls per user (solved + submissions)
  - Derives weekly stats, monthly stats, AND streak from those 2 responses
  - Replaces the old 4-call approach (solved + calendar + contest + submissions)

Rate limit math with 2 calls/user:
  - Budget: 90/hour
  - Usable for syncs: ~80/hour (leaving 10 for setup + manual)
  - Users synced/hour: 80 ÷ 2 = 40
  - 600 users: 600 ÷ 40 = 15 hours — fits comfortably in 24
"""

import asyncio
import httpx
import json
from datetime import datetime, timedelta, date
from typing import Any, Dict, Optional

from app.core.config import settings
from app.utils.api_rate_limiter import leetcode_rate_limiter


class LeetCodeService:
    LEETCODE_API_URL = settings.LEETCODE_API_URL or "https://alfa-leetcode-api.onrender.com"

    # Class-level reference to the singleton — all instances share one budget
    _limiter = leetcode_rate_limiter

    # ── Internal transport ─────────────────────────────────────────────────────

    async def _get(self, url: str) -> Optional[Dict[str, Any]]:
        """
        Acquire a rate-limit slot, then make one GET request.
        Every public method in this class must go through here.
        """
        await self._limiter.acquire()
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, timeout=15.0)
                if response.status_code == 200:
                    return response.json()
                return None
            except Exception as e:
                print(f"LeetCode API error [{url}]: {e}")
                return None

    # ── Public endpoints ───────────────────────────────────────────────────────

    async def get_profile(self, leetcode_username: str) -> Optional[Dict[str, Any]]:
        """GET /:username — basic profile (name, avatar, social links, country…)"""
        return await self._get(f"{self.LEETCODE_API_URL}/{leetcode_username}")

    async def get_solved_stats(self, leetcode_username: str) -> Optional[Dict[str, Any]]:
        """
        GET /:username/solved — all-time problem counts by difficulty.

        Returns: {"total": int, "easy": int, "medium": int, "hard": int}
        """
        data = await self._get(f"{self.LEETCODE_API_URL}/{leetcode_username}/solved")
        if not data:
            return None
        return {
            "total":  data.get("solvedProblem", 0),
            "easy":   data.get("easySolved",    0),
            "medium": data.get("mediumSolved",  0),
            "hard":   data.get("hardSolved",    0),
        }

    async def get_recent_submissions(
        self, leetcode_username: str, limit: int = 200
    ) -> Optional[list]:
        """
        GET /:username/submission?limit=N
        Returns list of submission objects with timestamp, statusDisplay, difficulty, title.
        """
        data = await self._get(
            f"{self.LEETCODE_API_URL}/{leetcode_username}/submission?limit={limit}"
        )
        return data.get("submission", []) if data else None

    # ── Primary sync entry-point: 2 calls ─────────────────────────────────────

    async def get_sync_data(self, username: str) -> Dict[str, Any]:
        """
        Fetch everything needed for a profile sync in exactly 2 API calls:

          Call 1: /solved        → all-time easy / medium / hard totals
          Call 2: /submission?200 → last 200 submissions

        From submissions we derive (no extra calls):
          - Weekly stats  (last 7 days, unique accepted, difficulty breakdown)
          - Monthly stats (last 30 days, unique accepted, difficulty breakdown)
          - Current streak and longest streak (from submission timestamps)

        Contest rating is intentionally skipped — it changes only after a
        user participates in a weekly contest and adds one API call for
        data that barely moves the scoring needle.

        Returns:
            {
                "solved_stats":    {"total", "easy", "medium", "hard"} | None,
                "weekly_stats":    {"total", "easy", "medium", "hard"},
                "monthly_stats":   {"total", "easy", "medium", "hard"},
                "current_streak":  int,
                "longest_streak":  int,
            }
        """
        # Fire both calls in parallel — each acquires its own rate-limit slot
        solved_stats, submissions = await asyncio.gather(
            self.get_solved_stats(username),
            self.get_recent_submissions(username, limit=200),
        )

        submissions = submissions or []
        weekly_stats, monthly_stats = self.calculate_weekly_and_monthly_stats(submissions)
        current_streak, longest_streak = self.calculate_streak_from_submissions(submissions)

        return {
            "solved_stats":   solved_stats,
            "weekly_stats":   weekly_stats,
            "monthly_stats":  monthly_stats,
            "current_streak": current_streak,
            "longest_streak": longest_streak,
        }

    # ── Stat derivation (pure Python, no API calls) ────────────────────────────

    def calculate_weekly_and_monthly_stats(
        self, submissions: list
    ) -> tuple[Dict[str, int], Dict[str, int]]:
        """
        Compute both weekly (7-day) and monthly (30-day) stats from a single
        pre-fetched submissions list in one pass.

        Returns: (weekly_stats, monthly_stats)
        """
        empty = {"easy": 0, "medium": 0, "hard": 0, "total": 0}
        if not submissions:
            return dict(empty), dict(empty)

        now = datetime.now()
        week_cutoff  = (now - timedelta(days=7)).timestamp()
        month_cutoff = (now - timedelta(days=30)).timestamp()

        weekly:  Dict[str, int] = {"easy": 0, "medium": 0, "hard": 0, "total": 0}
        monthly: Dict[str, int] = {"easy": 0, "medium": 0, "hard": 0, "total": 0}
        seen_weekly:  set[str] = set()
        seen_monthly: set[str] = set()

        for sub in submissions:
            if sub.get("statusDisplay") != "Accepted":
                continue

            ts         = float(sub.get("timestamp", 0))
            title      = sub.get("title", "")
            difficulty = sub.get("difficulty", "").lower()

            if ts >= month_cutoff and title not in seen_monthly:
                seen_monthly.add(title)
                if difficulty in ("easy", "medium", "hard"):
                    monthly[difficulty] += 1
                monthly["total"] += 1

            if ts >= week_cutoff and title not in seen_weekly:
                seen_weekly.add(title)
                if difficulty in ("easy", "medium", "hard"):
                    weekly[difficulty] += 1
                weekly["total"] += 1

        return weekly, monthly

    def calculate_streak_from_submissions(
        self, submissions: list
    ) -> tuple[int, int]:
        """
        Derive current and longest streak from submission timestamps.
        Replaces the separate /calendar API call (saves 1 call per sync).

        Accuracy note: bounded by the 200-submission window.  For users
        solving many problems per day the window covers fewer calendar
        days, so very long streaks may be slightly underestimated.
        That's an acceptable trade-off for a 50% reduction in API calls.

        Returns: (current_streak, longest_streak)
        """
        if not submissions:
            return (0, 0)

        accepted_dates: set[date] = set()
        for sub in submissions:
            if sub.get("statusDisplay") != "Accepted":
                continue
            ts = sub.get("timestamp")
            if ts:
                try:
                    day = datetime.fromtimestamp(int(ts)).date()
                    accepted_dates.add(day)
                except (ValueError, OSError):
                    continue

        if not accepted_dates:
            return (0, 0)

        today     = datetime.now().date()
        yesterday = today - timedelta(days=1)
        # Sorted newest → oldest for streak walk
        sorted_dates = sorted(accepted_dates, reverse=True)

        # ── Current streak ──────────────────────────────────────────────
        current_streak = 0
        if sorted_dates[0] >= yesterday:   # must have solved today or yesterday
            current_streak = 1
            for i in range(1, len(sorted_dates)):
                gap = (sorted_dates[i - 1] - sorted_dates[i]).days
                if gap == 1:
                    current_streak += 1
                elif gap == 0:
                    continue               # same day, multiple submissions
                else:
                    break                  # gap in streak

        # ── Longest streak in the available window ──────────────────────
        longest_streak = 1 if accepted_dates else 0
        temp = 1
        for i in range(1, len(sorted_dates)):
            gap = (sorted_dates[i - 1] - sorted_dates[i]).days
            if gap == 1:
                temp += 1
                longest_streak = max(longest_streak, temp)
            elif gap == 0:
                continue
            else:
                temp = 1

        return (current_streak, longest_streak)

    # ── Legacy helpers (kept for backward compat, not used in sync path) ───────

    async def get_calendar(
        self, leetcode_username: str, year: int = None
    ) -> Optional[Dict[str, Any]]:
        """
        GET /:username/calendar  (not used in primary sync path)
        Kept for one-off debugging or future use.
        """
        url = f"{self.LEETCODE_API_URL}/{leetcode_username}/calendar"
        if year:
            url += f"?year={year}"
        return await self._get(url)

    async def get_contest_info(
        self, leetcode_username: str
    ) -> Optional[Dict[str, Any]]:
        """
        GET /:username/contest  (not used in primary sync path)
        Contest rating changes only after participating in a weekly contest.
        Call this separately and infrequently if you need it.
        """
        return await self._get(f"{self.LEETCODE_API_URL}/{leetcode_username}/contest")

    def calculate_streak(self, calendar_data: Dict[str, Any]) -> tuple[int, int]:
        """
        Calendar-based streak (legacy).  Prefer calculate_streak_from_submissions.
        """
        if not calendar_data:
            return (0, 0)

        submissions = calendar_data.get("submissionCalendar")
        if not submissions:
            return (0, 0)

        if isinstance(submissions, str):
            try:
                submissions = json.loads(submissions)
            except json.JSONDecodeError:
                return (0, 0)

        if not isinstance(submissions, dict) or not submissions:
            return (0, 0)

        try:
            dates = sorted([int(ts) for ts in submissions.keys()])
        except (ValueError, TypeError):
            return (0, 0)

        if not dates:
            return (0, 0)

        one_day = 86400
        today   = int(datetime.now().timestamp())

        current_streak = 0
        check_date = today
        for _ in range(365):
            day_start = check_date - one_day
            if any(day_start <= d <= check_date for d in dates):
                current_streak += 1
                check_date -= one_day
            else:
                break

        longest_streak = 1
        temp_streak    = 1
        for i in range(1, len(dates)):
            if (dates[i] - dates[i - 1]) / one_day <= 2:
                temp_streak += 1
                longest_streak = max(longest_streak, temp_streak)
            else:
                temp_streak = 1

        return (current_streak, longest_streak)

    def _count_submissions_in_range(
        self, calendar_data: Dict[str, Any], days: int
    ) -> int:
        submissions = calendar_data.get("submissionCalendar")
        if not submissions:
            return 0
        if isinstance(submissions, str):
            try:
                submissions = json.loads(submissions)
            except json.JSONDecodeError:
                return 0
        if not isinstance(submissions, dict):
            return 0
        now     = int(datetime.now().timestamp())
        cutoff  = now - (days * 86400)
        return sum(
            count for ts, count in submissions.items()
            if int(ts) >= cutoff
        )
