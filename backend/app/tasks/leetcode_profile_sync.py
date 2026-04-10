from datetime import datetime, timezone
from app.utils.leetcode_services import LeetCodeService
from app import crud


async def sync_profile(session, profile) -> bool:
    """
    Sync a single CrackMode profile.

    API call budget: 2  (down from the original 6, down from the previous 4)
      1. /solved          — all-time easy / medium / hard totals
      2. /submission?200  — weekly stats + monthly stats + streak

    Both calls run in parallel inside get_sync_data().
    Each acquires a slot from the shared rate limiter before firing,
    so the 90-call/hour budget is respected automatically.

    Sets profile.sync_error on failure for observability.
    Returns True on success, False on failure.
    """
    try:
        leetcode = LeetCodeService()
        data = await leetcode.get_sync_data(profile.leetcode_username)

        solved_stats = data["solved_stats"]
        if not solved_stats:
            error_msg = "LeetCode API returned no solved stats"
            profile.sync_error = error_msg
            session.add(profile)
            session.commit()
            return False

        crud.update_crackmode_stats_with_velocity(
            session=session,
            profile=profile,
            all_time_stats={
                "easy":           solved_stats["easy"],
                "medium":         solved_stats["medium"],
                "hard":           solved_stats["hard"],
                "total":          solved_stats["total"],
                # Contest rating not fetched here — changes only after weekly
                # contests, so it barely moves.  Kept at its last known value.
                "contest_rating": profile.contest_rating,
                "current_streak": data["current_streak"],
                "longest_streak": data["longest_streak"],
            },
            weekly_stats=data["weekly_stats"],
            monthly_stats=data["monthly_stats"],
        )
        return True

    except Exception as e:
        error_msg = str(e)[:500]
        print(f"❌ Failed to sync {profile.leetcode_username}: {error_msg}")
        try:
            profile.sync_error = error_msg
            profile.updated_at = datetime.now(timezone.utc)
            session.add(profile)
            session.commit()
        except Exception:
            pass
        return False
