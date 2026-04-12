from fastapi import HTTPException
from sqlmodel import Session, select, func
from sqlalchemy.orm import selectinload
from app.core.security import verify_password
from uuid import UUID
from app.utils.logger_config import llm_logger
from app.models import CrackModeProfile, SyncTask, User
from typing import Optional, List
from datetime import datetime, timezone
from app.utils import scoring


def get_user_by_email(session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()


def base_user_query():
    return select(User).options(
        selectinload(User.crackmode_profile),
    )


def get_user_by_id(session: Session, user_id: int) -> User | None:
    """
    Get user by ID with all related data eager-loaded

    Loads:
    - User profile
    - CrackMode profile (if exists)
    """
    query = base_user_query().where(User.id == user_id)
    return session.exec(query).first()


def get_user_by_uuid(session: Session, user_uuid: UUID) -> User | None:
    """
    Get user by UUID with all related data eager-loaded

    Same as get_user_by_id but uses UUID for lookup
    """
    query = base_user_query().where(User.uuid == user_uuid)
    return session.exec(query).first()


def get_user_by_identifier(session: Session, identifier: str) -> User | None:
    """
    Get user by ID or UUID with automatic detection

    Args:
        identifier: Can be numeric user_id or UUID string

    Returns:
        User with all related data eager-loaded
    """
    # Try to parse as integer (user_id)
    try:
        user_id = int(identifier)
        return get_user_by_id(session, user_id)
    except ValueError:
        # Not numeric, try as UUID
        try:
            user_uuid = UUID(identifier)
            return get_user_by_uuid(session, user_uuid)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid identifier format. Must be numeric ID or valid UUID",
            )


def create_user_from_supabase(
    session: Session, user_id: UUID, email: str, full_name: str, avatar_url: str
) -> User:
    user = User(
        uuid=user_id,
        email=email,
        full_name=full_name,
        avatar_url=avatar_url,
        hashed_password="",  # Password managed by Supabase, so blank here
        is_active=True,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def sync_user_from_supabase(
    session: Session,
    user_id: UUID,
    email: str,
    full_name: str | None = None,
    avatar_url: str | None = None,
) -> User:
    """
    Syncs a user from Supabase by creating or updating their record.
    """
    user = get_user_by_id(session, user_id)

    if not user:
        user = create_user_from_supabase(session, user_id, email, full_name, avatar_url)

    # Update user's full name if provided
    if full_name:
        user.full_name = full_name

    if avatar_url:
        user.avatar_url = avatar_url

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


def update_synced_user_info(
    session: Session,
    user: User,
    email: str,
    full_name: str | None = None,
    avatar_url: str | None = None,
) -> User:
    """
    Updates user info only if changed. Logs each updated field.
    """
    updated = False

    if user.email != email:
        user.email = email
        updated = True

    if full_name is not None and user.full_name != full_name:
        user.full_name = full_name
        updated = True

    if avatar_url is not None and user.avatar_url != avatar_url:
        user.avatar_url = avatar_url
        updated = True

    if updated:
        session.add(user)
        session.commit()
        session.refresh(user)
    else:
        raise HTTPException(status_code=200, detail="No changes detected.")

    return user


def update_user_extended_profile(
    session: Session,
    user: User,
    profile_data: dict
) -> User:
    """
    Update user's extended profile fields from LeetCode API data
    
    Args:
        session: Database session
        user: User object to update
        profile_data: Dictionary with profile data from LeetCode API
    
    Returns:
        Updated user object
    """
    updated = False
    
    # Map LeetCode fields to User model fields
    field_mapping = {
        'gitHub': 'github_url',
        'twitter': 'twitter_url',
        'linkedIN': 'linkedin_url',
        'country': 'country',
        'company': 'company',
        'school': 'school',
        'about': 'about',
    }
    
    for leetcode_field, user_field in field_mapping.items():
        if leetcode_field in profile_data and profile_data[leetcode_field]:
            new_value = profile_data[leetcode_field]
            current_value = getattr(user, user_field)
            
            if current_value != new_value:
                setattr(user, user_field, new_value)
                updated = True
    
    # Handle website (list -> single string)
    if 'website' in profile_data and profile_data['website']:
        new_website = profile_data['website'][0] if isinstance(profile_data['website'], list) else profile_data['website']
        if user.website_url != new_website:
            user.website_url = new_website
            updated = True
    
    # Handle avatar if provided
    if 'avatar' in profile_data and profile_data['avatar']:
        if user.avatar_url != profile_data['avatar']:
            user.avatar_url = profile_data['avatar']
            updated = True
    
    # Handle name if provided and user.full_name is empty
    if 'name' in profile_data and profile_data['name'] and not user.full_name:
        user.full_name = profile_data['name']
        updated = True
    
    if updated:
        user.updated_at = datetime.now(timezone.utc)
        session.add(user)
        session.commit()
        session.refresh(user)
    
    return user


def get_crackmode_profile_by_user_id(
    session: Session, 
    user_id: int
) -> Optional[CrackModeProfile]:
    """Get CrackMode profile by user ID"""
    statement = select(CrackModeProfile).where(CrackModeProfile.user_id == user_id)
    return session.exec(statement).first()


def get_crackmode_profile_by_leetcode_username(
    session: Session, 
    leetcode_username: str
) -> Optional[CrackModeProfile]:
    """Get CrackMode profile by LeetCode username"""
    statement = select(CrackModeProfile).where(
        CrackModeProfile.leetcode_username == leetcode_username
    )
    return session.exec(statement).first()


def create_crackmode_profile(
    session: Session,
    user_id: int,
    leetcode_username: str,
    initial_stats: dict,
) -> CrackModeProfile:
    """
    Create a new CrackMode profile.

    Division always starts at Bronze regardless of all-time problem count.
    We have no weekly/monthly velocity data at setup time, so placing anyone
    above Bronze based on raw totals would give them a misleading rank that
    crashes on their first real sync. Bronze is honest — the first sync will
    place them correctly.
    """
    easy   = initial_stats.get("easy",   0)
    medium = initial_stats.get("medium", 0)
    hard   = initial_stats.get("hard",   0)
    total  = initial_stats.get("total",  0)

    difficulty_points = easy * 1 + medium * 3 + hard * 5
    streak_bonus  = initial_stats.get("current_streak", 0) * 10
    contest_bonus = initial_stats.get("contest_rating",  0) // 10

    profile = CrackModeProfile(
        user_id=user_id,
        leetcode_username=leetcode_username,
        # Start everyone in Bronze — first sync will set the real division
        division="Bronze",
        total_easy=easy,
        total_medium=medium,
        total_hard=hard,
        total_problems_solved=total,
        difficulty_points=difficulty_points,
        streak_bonus=streak_bonus,
        contest_bonus=contest_bonus,
        total_score=difficulty_points + streak_bonus + contest_bonus,
        contest_rating=initial_stats.get("contest_rating", 0),
        current_streak=initial_stats.get("current_streak", 0),
        longest_streak=initial_stats.get("longest_streak", 0),
        last_synced=datetime.now(timezone.utc),
    )

    session.add(profile)
    session.commit()
    session.refresh(profile)
    return profile




def get_leaderboard(
    session: Session,
    division: Optional[str] = None,
    season: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
) -> tuple[List[CrackModeProfile], int]:
    """
    Get leaderboard with optional filters.

    Returns (profiles, total_count) where total_count is the number of
    rows matching the filters — not just the current page size.

    Sort order:
    - Division filter active → order by division_rank (performance_score rank within tier)
    - No division filter    → order by global rank (total_score rank)
    """
    filters = []
    if division:
        filters.append(CrackModeProfile.division == division)
    if season:
        filters.append(CrackModeProfile.season == season)

    # Total matching rows (for real pagination)
    count_stmt = select(func.count(CrackModeProfile.id))
    for f in filters:
        count_stmt = count_stmt.where(f)
    total_count = session.exec(count_stmt).one()

    # Sort by division_rank when filtered, global rank otherwise
    order_col = (
        CrackModeProfile.division_rank.asc()
        if division
        else CrackModeProfile.rank.asc()
    )

    stmt = (
        select(CrackModeProfile)
        .options(selectinload(CrackModeProfile.user))
        .order_by(order_col)
        .offset(offset)
        .limit(limit)
    )
    for f in filters:
        stmt = stmt.where(f)

    return list(session.exec(stmt).all()), total_count




    
def update_crackmode_stats_with_velocity(
    session: Session,
    profile: CrackModeProfile,
    all_time_stats: dict,
    weekly_stats: dict,
    monthly_stats: dict,
) -> CrackModeProfile:
    """
    Update profile with all-time + weekly/monthly velocity stats
    
    Args:
        session: DB session
        profile: CrackMode profile to update
        all_time_stats: {easy, medium, hard, total, contest_rating, current_streak, longest_streak}
        weekly_stats: {easy, medium, hard, total} for last 7 days
        monthly_stats: {easy, medium, hard, total} for last 30 days
    
    Returns:
        Updated profile
    """
    
    # ===== UPDATE ALL-TIME STATS =====
    profile.total_easy = all_time_stats.get("easy", profile.total_easy)
    profile.total_medium = all_time_stats.get("medium", profile.total_medium)
    profile.total_hard = all_time_stats.get("hard", profile.total_hard)
    profile.total_problems_solved = all_time_stats.get("total", profile.total_problems_solved)
    profile.contest_rating = all_time_stats.get("contest_rating", profile.contest_rating)
    profile.current_streak = all_time_stats.get("current_streak", profile.current_streak)
    profile.longest_streak = max(
        profile.longest_streak,
        all_time_stats.get("longest_streak", 0)
    )
    
    # ===== UPDATE WEEKLY STATS (FIFA SYSTEM) =====
    profile.weekly_easy = weekly_stats.get("easy", 0)
    profile.weekly_medium = weekly_stats.get("medium", 0)
    profile.weekly_hard = weekly_stats.get("hard", 0)
    profile.weekly_total = weekly_stats.get("total", 0)
    profile.weekly_solves = weekly_stats.get("total", 0)  # For leaderboard display
    profile.weekly_stats_updated_at = datetime.now(timezone.utc)
    
    # ===== UPDATE MONTHLY STATS (FIFA SYSTEM) =====
    profile.monthly_easy = monthly_stats.get("easy", 0)
    profile.monthly_medium = monthly_stats.get("medium", 0)
    profile.monthly_hard = monthly_stats.get("hard", 0)
    profile.monthly_total = monthly_stats.get("total", 0)
    profile.monthly_stats_updated_at = datetime.now(timezone.utc)
    
    # ===== CALCULATE ALL-TIME SCORE (for leaderboard display) =====
    profile.difficulty_points = (
        profile.total_easy * 1 +
        profile.total_medium * 3 +
        profile.total_hard * 5
    )
    profile.streak_bonus = profile.current_streak * 10
    profile.contest_bonus = profile.contest_rating // 10
    
    profile.total_score = (
        profile.difficulty_points +
        profile.streak_bonus +
        profile.weekly_bonus +
        profile.contest_bonus
    )
    
    # ===== 🎮 CALCULATE PERFORMANCE SCORE (determines division) =====
    profile.performance_score = scoring.calculate_performance_score(
        profile=profile,
        weekly_stats=weekly_stats,
        monthly_stats=monthly_stats,
    )
    
    # ===== UPDATE DIVISION (with relegation buffer) =====
    # Pass current_division so the 20%-below-floor protection is applied.
    # Without this, determine_division_by_score takes the raw path and the
    # relegation buffer is never used — fix for the dead-code bug.
    new_division = scoring.determine_division_by_score(
        profile.performance_score, profile.division
    )
    if profile.division != new_division:
        print(f"🎮 Division change: {profile.leetcode_username} {profile.division} → {new_division}")
    profile.division = new_division
    
    # ===== UPDATE METADATA =====
    profile.last_synced = datetime.now(timezone.utc)
    profile.sync_error = None
    profile.updated_at = datetime.now(timezone.utc)
    
    session.add(profile)
    session.commit()
    session.refresh(profile)
    
    return profile



def update_division_rankings(session: Session):
    """
    🎮 Update division ranks WITHIN each division based on performance_score.
    
    NOTE: Division PLACEMENT is handled in real-time during sync via 
    scoring.determine_division_by_score(). This function only updates
    the division_rank (position within a division), NOT which division 
    a user belongs to.
    """
    divisions = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"]

    for division in divisions:
        profiles = list(session.exec(
            select(CrackModeProfile)
            .where(CrackModeProfile.division == division)
            .order_by(CrackModeProfile.performance_score.desc())
        ).all())

        for rank, profile in enumerate(profiles, start=1):
            profile.division_rank = rank

    session.commit()


def update_global_rankings(session: Session):
    """
    Update global rankings based on total_score (for display purposes)
    
    Note: Division placement is based on performance_score, not total_score
    """
    profiles = list(session.exec(
        select(CrackModeProfile).order_by(CrackModeProfile.total_score.desc())
    ).all())
    
    for rank, profile in enumerate(profiles, start=1):
        profile.rank = rank
    
    session.commit()


def get_all_crackmode_profiles(session: Session) -> list[CrackModeProfile]:
    return session.exec(select(CrackModeProfile)).all()



def create_sync_task(
    session: Session,
    task_type: str = "daily_sync",
    triggered_by_user_id: Optional[int] = None,
) -> SyncTask:
    task = SyncTask(task_type=task_type, triggered_by_user_id=triggered_by_user_id)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


def get_sync_task(session: Session, task_id: str) -> Optional[SyncTask]:
    return session.get(SyncTask, task_id)


def get_latest_sync_task(session: Session, task_type: str = "daily_sync") -> Optional[SyncTask]:
    return session.exec(
        select(SyncTask)
        .where(SyncTask.task_type == task_type)
        .order_by(SyncTask.created_at.desc())
        .limit(1)
    ).first()


def update_sync_task(session: Session, task: SyncTask, **kwargs) -> SyncTask:
    for key, value in kwargs.items():
        setattr(task, key, value)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


def get_top_solvers_this_week(session: Session, limit: int = 3) -> list[CrackModeProfile]:
    return list(session.exec(
        select(CrackModeProfile)
        .order_by(CrackModeProfile.weekly_total.desc())
        .limit(limit)
    ).all())


def get_longest_streak_user(session: Session) -> CrackModeProfile | None:
    return session.exec(
        select(CrackModeProfile)
        .order_by(CrackModeProfile.current_streak.desc())
        .limit(1)
    ).first()


def get_weekly_winner(session: Session) -> CrackModeProfile | None:
    return session.exec(
        select(CrackModeProfile)
        .order_by(CrackModeProfile.weekly_total.desc())
        .limit(1)
    ).first()


def get_division_leaders(session: Session) -> dict[str, CrackModeProfile | None]:
    divisions = ["Diamond", "Platinum", "Gold", "Silver", "Bronze"]
    leaders = {}
    for division in divisions:
        leader = session.exec(
            select(CrackModeProfile)
            .where(CrackModeProfile.division == division)
            .order_by(CrackModeProfile.performance_score.desc())
            .limit(1)
        ).first()
        if leader:
            leaders[division] = leader
    return leaders

def get_most_active_today(session: Session, limit: int = 3) -> list:
    """Users who synced today — proxy for activity."""
    from datetime import datetime, timedelta, timezone
    cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
    return list(session.exec(
        select(CrackModeProfile)
        .where(CrackModeProfile.last_synced >= cutoff)
        .order_by(CrackModeProfile.weekly_total.desc())
        .limit(limit)
    ).all())


def get_streak_leaders(session: Session, limit: int = 3) -> list:
    return list(session.exec(
        select(CrackModeProfile)
        .where(CrackModeProfile.current_streak > 0)
        .order_by(CrackModeProfile.current_streak.desc())
        .limit(limit)
    ).all())


# ── CrackCompetition ──────────────────────────────────────────────────────────

def snapshot_competition_baselines(session: Session) -> int:
    """Snapshot total_score into competition_baseline_score for all profiles. Run once on Apr 20."""
    profiles = session.exec(select(CrackModeProfile)).all()
    for profile in profiles:
        profile.competition_baseline_score = profile.total_score
    session.commit()
    return len(profiles)


def get_competition_leaderboard(
    session: Session, limit: int = 100, offset: int = 0
) -> tuple[list[CrackModeProfile], int]:
    """Returns profiles sorted by competition score (total_score - competition_baseline_score) desc."""
    total_count = session.exec(select(func.count(CrackModeProfile.id))).one()
    profiles = list(session.exec(
        select(CrackModeProfile)
        .options(selectinload(CrackModeProfile.user))
        .order_by(
            (CrackModeProfile.total_score - CrackModeProfile.competition_baseline_score).desc()
        )
        .offset(offset)
        .limit(limit)
    ).all())
    return profiles, total_count