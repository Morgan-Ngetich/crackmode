import asyncio
from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.api.deps import SessionDep, CurrentUser, CurrentSuperAdmin
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
    One-time setup: link a LeetCode username to this account.

    API calls: 2
      1. GET /:username          — verify the username exists, grab social links
      2. GET /:username/solved   — initial all-time stats

    Calendar and contest are intentionally skipped at setup:
    - Streak starts at 0 and will be computed correctly on the first sync.
    - Contest rating starts at 0 and will be synced separately.
    Both are correct defaults for a brand-new profile.
    """
    existing = crud.get_crackmode_profile_by_user_id(session, current_user.id)
    if existing:
        raise HTTPException(
            status_code=400,
            detail="CrackMode profile already exists. Use /sync to update stats.",
        )
        
    # Check if username already claimed by another user
    if crud.get_crackmode_profile_by_leetcode_username(session, request.leetcode_username):
        raise HTTPException(
            status_code=409,
            detail="This LeetCode username is already linked to another account",
        )

    leetcode = LeetCodeService()

    # Fire both calls in parallel — 2 total, each rate-limited
    profile_data, solved_stats = await asyncio.gather(
        leetcode.get_profile(request.leetcode_username),
        leetcode.get_solved_stats(request.leetcode_username),
    )

    if not profile_data:
        raise HTTPException(
            status_code=400,
            detail=f"LeetCode user '{request.leetcode_username}' not found",
        )

    if not solved_stats:
        raise HTTPException(
            status_code=400,
            detail="Failed to fetch LeetCode stats. Please try again.",
        )

    crackmode_profile = crud.create_crackmode_profile(
        session=session,
        user_id=current_user.id,
        leetcode_username=request.leetcode_username,
        initial_stats={
            "easy":   solved_stats["easy"],
            "medium": solved_stats["medium"],
            "hard":   solved_stats["hard"],
            "total":  solved_stats["total"],
            # Streak and contest start at 0 — first sync will populate them
        },
    )

    # Persist social links / bio from LeetCode profile
    crud.update_user_extended_profile(
        session=session, user=current_user, profile_data=profile_data
    )

    # Rankings are heavy — run after the response is returned
    background_tasks.add_task(crud.update_global_rankings, session)
    background_tasks.add_task(crud.update_division_rankings, session)

    session.refresh(crackmode_profile)
    return crackmode_profile.to_public()


@router.post("/sync", response_model=CrackModeProfilePublic)
async def sync_my_leetcode_stats(
    current_user: CurrentUser,
    session: SessionDep,
    background_tasks: BackgroundTasks,
    force: bool = False,
):
    """
    Sync the current user's LeetCode stats.

    API calls: 2  (via sync_profile → get_sync_data)
      1. /solved
      2. /submission?200

    Extended profile data (GitHub, Twitter, LinkedIn…) is NOT refreshed
    on every sync — it was set at setup and changes very rarely.
    Refreshing it would cost a 3rd API call every 30 minutes per user.

    30-minute cooldown enforced unless force=true.
    """
    profile = crud.get_crackmode_profile_by_user_id(session, current_user.id)
    if not profile:
        raise HTTPException(404, detail="Profile not found. Please set up CrackMode first.")

    COOLDOWN_MINUTES = 30
    if not force and profile.last_synced:
        last_synced = profile.last_synced.replace(tzinfo=timezone.utc)
        elapsed = datetime.now(timezone.utc) - last_synced
        if elapsed.total_seconds() < COOLDOWN_MINUTES * 60:
            return profile.to_public()

    success = await sync_profile(session, profile)

    if not success:
        raise HTTPException(503, detail="LeetCode API unavailable. Please try again.")

    # Rankings are heavy — run after the response is returned
    background_tasks.add_task(crud.update_global_rankings, session)
    background_tasks.add_task(crud.update_division_rankings, session)

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
    Get leaderboard.

    Sort order:
    - With division filter  → ordered by division_rank (performance score within tier)
    - Without filter        → ordered by global rank (all-time total score)

    Returns total = full matching count for real pagination.
    """
    profiles, total_count = crud.get_leaderboard(
        session=session,
        division=division,
        season=season,
        limit=min(limit, 100),
        offset=offset,
    )

    return LeaderboardResponse(
        profiles=[p.to_public() for p in profiles],
        total=total_count,
        division=division,
        season=season,
    )


# ── CrackCompetition (Apr 20 – Jun 20 2026) ───────────────────────────────────

@router.get("/competition/leaderboard", response_model=LeaderboardResponse)
async def get_competition_leaderboard(
    session: SessionDep,
    limit: int = 100,
    offset: int = 0,
):
    """Competition leaderboard sorted by points earned since Apr 20 (total_score - baseline)."""
    profiles, total_count = crud.get_competition_leaderboard(
        session=session,
        limit=min(limit, 100),
        offset=offset,
    )
    return LeaderboardResponse(
        profiles=[p.to_public() for p in profiles],
        total=total_count,
    )


@router.post("/competition/snapshot", status_code=200)
async def snapshot_competition_baselines(
    session: SessionDep,
    _admin: CurrentSuperAdmin,
):
    """Admin-only: snapshot current total_score as competition baseline for all profiles."""
    count = crud.snapshot_competition_baselines(session)
    return {"snapshotted": count}
