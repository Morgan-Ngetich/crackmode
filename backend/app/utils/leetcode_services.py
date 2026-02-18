import httpx
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from app.core.config import settings

class LeetCodeService:
    """Service to interact with LeetCode API"""
    
    LEETCODE_API_URL = settings.LEETCODE_API_URL or "https://alfa-leetcode-api.onrender.com"
    
    async def get_profile(self, leetcode_username: str) -> Optional[Dict[str, Any]]:
        """
        Get user profile
        GET /:username
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.LEETCODE_API_URL}/{leetcode_username}",
                    timeout=10.0
                )
                if response.status_code == 200:
                    return response.json()
                return None
            except Exception as e:
                print(f"Error fetching profile for {leetcode_username}: {e}")
                return None
            
    async def get_profile_details(self, leetcode_username: str) -> Optional[Dict[str, Any]]:
        """
        Get user profile
        GET /:username/profile
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.LEETCODE_API_URL}/{leetcode_username}/profile",
                    timeout=10.0
                )
                if response.status_code == 200:
                    return response.json()
                return None
            except Exception as e:
                print(f"Error fetching profile for {leetcode_username}: {e}")
                return None
    
    async def get_solved_stats(self, leetcode_username: str) -> Optional[Dict[str, Any]]:
        """
        Get solved problems breakdown
        GET /:username/solved
        
        Returns: {
            "solvedProblem": 450,
            "easySolved": 200,
            "mediumSolved": 180,
            "hardSolved": 70,
            ...
        }
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.LEETCODE_API_URL}/{leetcode_username}/solved",
                    timeout=10.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "total": data.get("solvedProblem", 0),
                        "easy": data.get("easySolved", 0),
                        "medium": data.get("mediumSolved", 0),
                        "hard": data.get("hardSolved", 0),
                    }
                return None
            except Exception as e:
                print(f"Error fetching solved stats for {leetcode_username}: {e}")
                return None
    
    async def get_calendar(self, leetcode_username: str, year: int = None) -> Optional[Dict[str, Any]]:
        """
        Get submission calendar (for streak calculation)
        GET /:username/calendar
        GET /:username/calendar?year=2025
        
        Returns: {
            "submissionCalendar": {
                "1704067200": 5,  # timestamp: submission count
                ...
            }
        }
        """
        url = f"{self.LEETCODE_API_URL}/{leetcode_username}/calendar"
        if year:
            url += f"?year={year}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, timeout=10.0)
                if response.status_code == 200:
                    return response.json()
                return None
            except Exception as e:
                print(f"Error fetching calendar for {leetcode_username}: {e}")
                return None
    
    async def get_contest_info(self, leetcode_username: str) -> Optional[Dict[str, Any]]:
        """
        Get contest rating
        GET /:username/contest
        
        Returns: {
            "contestAttend": 25,
            "contestRating": 1650,
            "contestGlobalRanking": 15000,
            ...
        }
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.LEETCODE_API_URL}/{leetcode_username}/contest",
                    timeout=10.0
                )
                if response.status_code == 200:
                    return response.json()
                return None
            except Exception as e:
                print(f"Error fetching contest info for {leetcode_username}: {e}")
                return None
    
    async def get_recent_submissions(
        self, 
        leetcode_username: str, 
        limit: int = 20
    ) -> Optional[list]:
        """
        Get recent submissions
        GET /:username/submission?limit=20
        
        Returns list of submissions
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.LEETCODE_API_URL}/{leetcode_username}/submission?limit={limit}",
                    timeout=10.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return data.get("submission", [])
                return None
            except Exception as e:
                print(f"Error fetching submissions for {leetcode_username}: {e}")
                return None
    
    async def get_weekly_stats(self, leetcode_username: str) -> Dict[str, int]:
        """
        🎮 FIFA SYSTEM: Get problems solved in last 7 days with difficulty breakdown
        
        Returns: {
            "total": 15,
            "easy": 5,
            "medium": 8,
            "hard": 2
        }
        """
        # Get calendar for submission counts per day
        calendar_data = await self.get_calendar(leetcode_username)
        
        if not calendar_data:
            return {"total": 0, "easy": 0, "medium": 0, "hard": 0}
        
        # Get recent submissions for difficulty breakdown
        recent = await self.get_recent_submissions(leetcode_username, limit=100)
        
        if not recent:
            # Fall back to calendar-only count (no difficulty breakdown)
            total = self._count_submissions_in_range(calendar_data, days=7)
            return {"total": total, "easy": 0, "medium": 0, "hard": 0}
        
        # Calculate from recent submissions
        now = datetime.now()
        week_ago = (now - timedelta(days=7)).timestamp()
        
        weekly_stats = {"easy": 0, "medium": 0, "hard": 0, "total": 0}
        seen_problems = set()  # Track unique problems
        
        for submission in recent:
            # Check timestamp
            submit_time = float(submission.get("timestamp", 0))
            if submit_time < week_ago:
                continue
            
            # Only count accepted submissions
            if submission.get("statusDisplay") != "Accepted":
                continue
            
            # Avoid counting same problem multiple times
            problem_title = submission.get("title", "")
            if problem_title in seen_problems:
                continue
            seen_problems.add(problem_title)
            
            # Track difficulty
            difficulty = submission.get("difficulty", "").lower()
            if difficulty == "easy":
                weekly_stats["easy"] += 1
            elif difficulty == "medium":
                weekly_stats["medium"] += 1
            elif difficulty == "hard":
                weekly_stats["hard"] += 1
            
            weekly_stats["total"] += 1
        
        return weekly_stats
    
    async def get_monthly_stats(self, leetcode_username: str) -> Dict[str, int]:
        """
        🎮 FIFA SYSTEM: Get problems solved in last 30 days with difficulty breakdown
        
        Returns: {
            "total": 45,
            "easy": 15,
            "medium": 22,
            "hard": 8
        }
        """
        # Get recent submissions (limit 200 should cover a month for most users)
        recent = await self.get_recent_submissions(leetcode_username, limit=200)
        
        if not recent:
            return {"total": 0, "easy": 0, "medium": 0, "hard": 0}
        
        now = datetime.now()
        month_ago = (now - timedelta(days=30)).timestamp()
        
        monthly_stats = {"easy": 0, "medium": 0, "hard": 0, "total": 0}
        seen_problems = set()
        
        for submission in recent:
            submit_time = float(submission.get("timestamp", 0))
            if submit_time < month_ago:
                continue
            
            if submission.get("statusDisplay") != "Accepted":
                continue
            
            problem_title = submission.get("title", "")
            if problem_title in seen_problems:
                continue
            seen_problems.add(problem_title)
            
            difficulty = submission.get("difficulty", "").lower()
            if difficulty == "easy":
                monthly_stats["easy"] += 1
            elif difficulty == "medium":
                monthly_stats["medium"] += 1
            elif difficulty == "hard":
                monthly_stats["hard"] += 1
            
            monthly_stats["total"] += 1
        
        return monthly_stats
    
    def _count_submissions_in_range(
        self, 
        calendar_data: Dict[str, Any], 
        days: int
    ) -> int:
        """
        Helper: Count total submissions in last N days from calendar
        """
        submissions = calendar_data.get("submissionCalendar")
        
        if not submissions:
            return 0
        
        # Parse if string
        if isinstance(submissions, str):
            import json
            try:
                submissions = json.loads(submissions)
            except json.JSONDecodeError:
                return 0
        
        if not isinstance(submissions, dict):
            return 0
        
        now = int(datetime.now().timestamp())
        cutoff = now - (days * 86400)
        
        total = 0
        for timestamp, count in submissions.items():
            try:
                ts = int(timestamp)
                if ts >= cutoff:
                    total += count
            except (ValueError, TypeError):
                continue
        
        return total
    
    def calculate_streak(self, calendar_data: Dict[str, Any]) -> tuple[int, int]:
        """
        Calculate current streak and longest streak from calendar data
        
        Returns: (current_streak, longest_streak)
        """
        if not calendar_data:
            return (0, 0)
        
        # Get submissionCalendar
        submissions = calendar_data.get("submissionCalendar")
        
        if not submissions:
            return (0, 0)
        
        # FIX: Parse if it's a JSON string (LeetCode API returns this as a string)
        if isinstance(submissions, str):
            import json
            try:
                submissions = json.loads(submissions)
            except json.JSONDecodeError:
                print("❌ Failed to parse submissionCalendar JSON string")
                return (0, 0)
        
        # Ensure it's a dict
        if not isinstance(submissions, dict) or not submissions:
            return (0, 0)
        
        # Convert timestamps to sorted list of dates
        try:
            dates = sorted([int(ts) for ts in submissions.keys()])
        except (ValueError, TypeError, AttributeError) as e:
            print(f"❌ Error parsing dates: {e}")
            return (0, 0)
        
        if not dates:
            return (0, 0)
        
        one_day = 86400  # seconds in a day
        today = int(datetime.now().timestamp())
        
        # Calculate current streak (from today backwards)
        current_streak = 0
        check_date = today
        
        for _ in range(365):  # Max 1 year back
            day_start = check_date - one_day
            has_submission = any(day_start <= d <= check_date for d in dates)
            
            if has_submission:
                current_streak += 1
                check_date -= one_day
            else:
                break
        
        # Calculate longest streak
        longest_streak = 1
        temp_streak = 1
        
        for i in range(1, len(dates)):
            days_apart = (dates[i] - dates[i-1]) / one_day
            
            # Consider consecutive if within 2 days (timezone buffer)
            if days_apart <= 2:
                temp_streak += 1
                longest_streak = max(longest_streak, temp_streak)
            else:
                temp_streak = 1
        
        return (current_streak, longest_streak)