from app.core.db import get_session
from app.utils.leetcode_services import LeetCodeService
from app import crud
from datetime import datetime, timezone


async def sync_profile(session, profile) -> bool:
    """Syncs a single crackmode profile. Returns True on success, False on failure."""
    try:
        leetcode = LeetCodeService()
        
        solved_stats  = await leetcode.get_solved_stats(profile.leetcode_username)
        calendar      = await leetcode.get_calendar(profile.leetcode_username)
        contest       = await leetcode.get_contest_info(profile.leetcode_username)
        weekly_stats  = await leetcode.get_weekly_stats(profile.leetcode_username)
        monthly_stats = await leetcode.get_monthly_stats(profile.leetcode_username)

        if not solved_stats:
            return False

        current_streak, longest_streak = (
            leetcode.calculate_streak(calendar) if calendar else (0, 0)
        )

        crud.update_crackmode_stats_with_velocity(
            session=session,
            profile=profile,
            all_time_stats={
                "easy":           solved_stats["easy"],
                "medium":         solved_stats["medium"],
                "hard":           solved_stats["hard"],
                "total":          solved_stats["total"],
                "contest_rating": contest.get("contestRating", 0) if contest else 0,
                "current_streak": current_streak,
                "longest_streak": longest_streak,
            },
            weekly_stats=weekly_stats,
            monthly_stats=monthly_stats,
        )
        return True

    except Exception as e:
        print(f"❌ Failed to sync {profile.leetcode_username}: {e}")
        return False