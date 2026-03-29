from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.api.deps import SessionDep, CurrentUser
from app.models import (
    CrackModeProfilePublic,
    CrackModeSetupRequest,
    LeaderboardResponse,
)
from app import crud
from app.utils.leetcode_services import LeetCodeService
from app.tasks.leetcode_profile_sync import sync_profile
from typing import Optional
from datetime import datetime, timezone

router = APIRouter(prefix="/crackmode", tags=["crackmode"])


@router.post("/setup", response_model=CrackModeProfilePublic)
async def setup_crackmode_profile(
    request: CrackModeSetupRequest,
    current_user: CurrentUser,
    session: SessionDep,
    background_tasks: BackgroundTasks,
):
    """
    Setup CrackMode profile by linking LeetCode username
    This is a one-time setup (unless user changes username)
    
    This endpoint also syncs extended profile data like:
    - GitHub, Twitter, LinkedIn URLs
    - Country, Company, School
    - About/Bio
    - Website
    """
    # Check if profile already exists
    existing = crud.get_crackmode_profile_by_user_id(session, current_user.id)

    if existing:
        raise HTTPException(
            status_code=400,
            detail="CrackMode profile already exists. Use /sync to update stats.",
        )

    # Verify LeetCode username exists and get profile data
    leetcode = LeetCodeService()
    profile_data = await leetcode.get_profile(request.leetcode_username)

    if not profile_data:
        raise HTTPException(
            status_code=400,
            detail=f"LeetCode user '{request.leetcode_username}' not found",
        )

    # Check if username already claimed by another user
    existing_username = crud.get_crackmode_profile_by_leetcode_username(
        session, request.leetcode_username
    )

    if existing_username:
        raise HTTPException(
            status_code=409,
            detail="This LeetCode username is already linked to another account",
        )

    # Fetch initial stats
    solved_stats = await leetcode.get_solved_stats(request.leetcode_username)
    calendar = await leetcode.get_calendar(request.leetcode_username)
    contest = await leetcode.get_contest_info(request.leetcode_username)

    if not solved_stats:
        raise HTTPException(
            status_code=400, detail="Failed to fetch LeetCode stats. Please try again."
        )

    # Calculate streaks
    current_streak, longest_streak = (
        leetcode.calculate_streak(calendar) if calendar else (0, 0)
    )

    initial_stats = {
        "easy": solved_stats["easy"],
        "medium": solved_stats["medium"],
        "hard": solved_stats["hard"],
        "total": solved_stats["total"],
        "contest_rating": contest.get("contestRating", 0) if contest else 0,
        "current_streak": current_streak,
        "longest_streak": longest_streak,
    }

    # Create CrackMode profile
    crackmode_profile = crud.create_crackmode_profile(
        session=session,
        user_id=current_user.id,
        leetcode_username=request.leetcode_username,
        initial_stats=initial_stats,
    )
    
    # Update user's extended profile with LeetCode data
    # This includes GitHub, Twitter, LinkedIn, website, country, company, school, about
    updated_user = crud.update_user_extended_profile(
        session=session,
        user=current_user,
        profile_data=profile_data
    )
    
    # Update rankings
    crud.update_rankings(session)
    
    # Refresh to get updated ranks
    session.refresh(crackmode_profile)

    # TODO: Uncomment when celery service is up.
    # # Trigger background ranking update
    # background_tasks.add_task(crud.update_rankings, session)

    return crackmode_profile.to_public()

@router.post("/sync", response_model=CrackModeProfilePublic)
async def sync_my_leetcode_stats(
    current_user: CurrentUser,
    session: SessionDep,
    force: bool = False,
):
    profile = crud.get_crackmode_profile_by_user_id(session, current_user.id)

    if not profile:
        raise HTTPException(404, detail="Profile not found. Please set up CrackMode first.")

    COOLDOWN_MINUTES = 30
    if not force and profile.last_synced:
        last_synced = profile.last_synced.replace(tzinfo=timezone.utc)
        elapsed = datetime.now(timezone.utc) - last_synced
        if elapsed.total_seconds() < COOLDOWN_MINUTES * 60:
            return profile.to_public()

    leetcode = LeetCodeService()
    success = await sync_profile(session, profile)

    if not success:
        raise HTTPException(503, detail="LeetCode API unavailable. Please try again.")

    if profile_data := await leetcode.get_profile(profile.leetcode_username):
        crud.update_user_extended_profile(session=session, user=current_user, profile_data=profile_data)

    crud.update_global_rankings(session)
    crud.update_division_rankings(session)
    session.refresh(profile)

    return profile.to_public()



@router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(
    session: SessionDep,
    division: Optional[str] = None,
    season: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
):
    """
    Get leaderboard

    Filters:
    - division: Bronze, Silver, Gold, Platinum, Diamond
    - season: Season 1, Season 2, etc.
    - limit: Number of results (max 100)
    - offset: Pagination offset
    """

    profiles = crud.get_leaderboard(
        session=session,
        division=division,
        season=season,
        limit=min(limit, 100),
        offset=offset,
    )

    return LeaderboardResponse(
        profiles=[p.to_public() for p in profiles],
        total=len(profiles),
        division=division,
        season=season,
    )