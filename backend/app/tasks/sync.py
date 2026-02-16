from app.core.celery import celery_app
from app.utils.validation import with_session
from uuid import UUID
from datetime import datetime, timezone

# TODO uncomment this after creating celery service on railway
# @celery_app.task(name="app.tasks.sync_user_from_supabase_task")
# @with_session
def sync_user_from_supabase_task(
  user_id: str,
  email: str, 
  full_name: str | None = None, 
  avatar_url: str | None = None, 
  *, 
  session
):
  # convert string back to UUID to sync to the database. Databse expects UUID
  user_id = UUID(user_id)
  
  from app import crud
  from app.core.config import settings
  
  user = crud.sync_user_from_supabase(
    session=session,
    user_id=user_id,
    email=email,
    full_name=full_name,
    avatar_url=avatar_url or settings.DEFAULT_AVATAR_URL
  )

  return {"status" : "success", "user_id": str(user.uuid)}



# TODO: Uncomment after creating celery service on railway
# @celery_app.task(name="app.tasks.sync_leetcode_stats_task")
# @with_session
def sync_leetcode_stats_task(
    user_id: int,
    leetcode_username: str,
    *,
    session
):
    """
    Background task to sync LeetCode stats for a user
    """
    from app import crud
    from app.utils.leetcode_services import LeetCodeService
    
    # Get profile
    profile = crud.get_crackmode_profile_by_user_id(session, user_id)
    
    if not profile:
        return {"status": "error", "message": "Profile not found"}
    
    # Fetch fresh stats from LeetCode
    leetcode = LeetCodeService()
    
    try:
        solved_stats = leetcode.get_solved_stats(leetcode_username)
        calendar = leetcode.get_calendar(leetcode_username)
        contest = leetcode.get_contest_info(leetcode_username)
        
        if not solved_stats:
            profile.sync_error = "Failed to fetch stats from LeetCode"
            session.commit()
            return {"status": "error", "message": "Failed to fetch stats"}
        
        # Calculate streaks
        current_streak, longest_streak = (
            leetcode.calculate_streak(calendar) if calendar else (0, 0)
        )
        
        stats = {
            "easy": solved_stats["easy"],
            "medium": solved_stats["medium"],
            "hard": solved_stats["hard"],
            "total": solved_stats["total"],
            "contest_rating": contest.get("contestRating", 0) if contest else 0,
            "current_streak": current_streak,
            "longest_streak": longest_streak,
        }
        
        # Update profile
        crud.update_crackmode_stats(session, profile, stats)
        
        # Update rankings
        crud.update_rankings(session)
        
        return {
            "status": "success",
            "user_id": user_id,
            "score": profile.total_score
        }
        
    except Exception as e:
        profile.sync_error = str(e)
        session.commit()
        return {"status": "error", "message": str(e)}


# Periodic task to sync all users (runs every 6 hours)
# @celery_app.task(name="app.tasks.sync_all_leetcode_stats")
# @with_session
def sync_all_leetcode_stats_task(*, session):
    """
    Background task to sync ALL users' LeetCode stats
    Run this every 6 hours via cron
    """
    from app.models import CrackModeProfile
    from sqlmodel import select
    
    profiles = session.exec(select(CrackModeProfile)).all()
    
    results = []
    for profile in profiles:
        result = sync_leetcode_stats_task(
            user_id=profile.user_id,
            leetcode_username=profile.leetcode_username,
            session=session,
        )
        results.append(result)
    
    return {
        "status": "completed",
        "total_synced": len(results),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
