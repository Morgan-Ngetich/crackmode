from fastapi import HTTPException
from typing import List
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from app.core.security import verify_password
from uuid import UUID
from app.utils.logger_config import llm_logger
from app.models import CrackModeProfile, User
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
    initial_stats: dict
) -> CrackModeProfile:
    """Create new CrackMode profile"""
    
    # Calculate initial division based on total problems
    total = initial_stats.get("total", 0)
    if total < 50:
        division = "Bronze"
    elif total < 150:
        division = "Silver"
    elif total < 300:
        division = "Gold"
    elif total < 500:
        division = "Platinum"
    else:
        division = "Diamond"
    
    # Calculate initial score
    difficulty_points = (
        initial_stats.get("easy", 0) * 1 +
        initial_stats.get("medium", 0) * 3 +
        initial_stats.get("hard", 0) * 5
    )
    
    profile = CrackModeProfile(
        user_id=user_id,
        leetcode_username=leetcode_username,
        division=division,
        total_score=difficulty_points,
        difficulty_points=difficulty_points,
        total_easy=initial_stats.get("easy", 0),
        total_medium=initial_stats.get("medium", 0),
        total_hard=initial_stats.get("hard", 0),
        total_problems_solved=total,
        contest_rating=initial_stats.get("contest_rating", 0),
        current_streak=initial_stats.get("current_streak", 0),
        longest_streak=initial_stats.get("longest_streak", 0),
        last_synced=datetime.now(timezone.utc),
    )
    
    session.add(profile)
    session.commit()
    session.refresh(profile)
    return profile


def update_crackmode_stats(
    session: Session,
    profile: CrackModeProfile,
    stats: dict
) -> CrackModeProfile:
    """ Update CrackMode profile with fresh LeetCode stats """
    
    # Update raw stats
    profile.total_easy = stats.get("easy", profile.total_easy)
    profile.total_medium = stats.get("medium", profile.total_medium)
    profile.total_hard = stats.get("hard", profile.total_hard)
    profile.total_problems_solved = stats.get("total", profile.total_problems_solved)
    profile.contest_rating = stats.get("contest_rating", profile.contest_rating)
    profile.current_streak = stats.get("current_streak", profile.current_streak)
    profile.longest_streak = max(
        profile.longest_streak, 
        stats.get("longest_streak", 0)
    )
    
    # Recalculate score components
    profile.difficulty_points = (
        profile.total_easy * 1 +
        profile.total_medium * 3 +
        profile.total_hard * 5
    )
    profile.streak_bonus = profile.current_streak * 10
    profile.contest_bonus = profile.contest_rating // 10
    
    # Update total score
    profile.total_score = (
        profile.difficulty_points +
        profile.streak_bonus +
        profile.weekly_bonus +
        profile.contest_bonus
    )
    
    # Update sync timestamp
    profile.last_synced = datetime.now(timezone.utc)
    profile.sync_error = None
    profile.updated_at = datetime.now(timezone.utc)
    
    session.add(profile)
    session.commit()
    session.refresh(profile)
    return profile


def get_leaderboard(
    session: Session,
    division: Optional[str] = None,
    season: Optional[str] = None,
    limit: int = 100,
    offset: int = 0
) -> List[CrackModeProfile]:
    """Get leaderboard with optional filters"""
    
    statement = select(CrackModeProfile).options(
        selectinload(CrackModeProfile.user)
    ).order_by(CrackModeProfile.rank.asc())
    
    if division:
        statement = statement.where(CrackModeProfile.division == division)
    
    if season:
        statement = statement.where(CrackModeProfile.season == season)
    
    statement = statement.offset(offset).limit(limit)
    
    return list(session.exec(statement).all())


def update_rankings(session: Session):
    """
    Recalculate global and division rankings
    Should be run periodically (e.g., every hour)
    """
    
    # Update global rankings
    profiles = session.exec(
        select(CrackModeProfile).order_by(CrackModeProfile.total_score.desc())
    ).all()
    
    for rank, profile in enumerate(profiles, start=1):
        profile.rank = rank
    
    # Update division rankings
    divisions = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"]
    for division in divisions:
        div_profiles = session.exec(
            select(CrackModeProfile)
            .where(CrackModeProfile.division == division)
            .order_by(CrackModeProfile.total_score.desc())
        ).all()
        
        for rank, profile in enumerate(div_profiles, start=1):
            profile.division_rank = rank
    
    session.commit()
    
    
    
    
def update_crackmode_stats_with_velocity(
    session: Session,
    profile: CrackModeProfile,
    all_time_stats: dict,
    weekly_stats: dict,
    monthly_stats: dict,
) -> CrackModeProfile:
    """
    🎮 FIFA SYSTEM: Update profile with all-time + weekly/monthly velocity stats
    
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
    
    # ===== 🎮 UPDATE DIVISION BASED ON PERFORMANCE SCORE =====
    new_division = scoring.determine_division_by_score(profile.performance_score)
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
    Recalculate division rankings based on performance_score
    
    This is run WEEKLY to promote/relegate users
    
    How it works:
    1. For each division, rank users by performance_score
    2. Top 20% get promoted (except Diamond)
    3. Bottom 20% get relegated (except Bronze)
    4. Middle 60% stay
    """
    
    divisions = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"]
    
    print("🎮 Starting weekly division update...")
    
    for i, division in enumerate(divisions):
        # Get all profiles in this division, sorted by performance_score
        profiles = list(session.exec(
            select(CrackModeProfile)
            .where(CrackModeProfile.division == division)
            .order_by(CrackModeProfile.performance_score.desc())
        ).all())
        
        if not profiles:
            continue
        
        total = len(profiles)
        promote_count = int(total * 0.2)  # Top 20%
        relegate_count = int(total * 0.2)  # Bottom 20%
        
        print(f"📊 {division}: {total} players (Promote: {promote_count}, Relegate: {relegate_count})")
        
        # ===== PROMOTE TOP 20% (except Diamond) =====
        if i < len(divisions) - 1:  # Not Diamond
            for profile in profiles[:promote_count]:
                old_division = profile.division
                profile.division = divisions[i + 1]
                print(f"  ⬆️ {profile.leetcode_username}: {old_division} → {profile.division}")
        
        # ===== RELEGATE BOTTOM 20% (except Bronze) =====
        if i > 0:  # Not Bronze
            for profile in profiles[-relegate_count:]:
                old_division = profile.division
                profile.division = divisions[i - 1]
                print(f"  ⬇️ {profile.leetcode_username}: {old_division} → {profile.division}")
        
        # ===== UPDATE DIVISION RANKS =====
        # Re-fetch after promotions/relegations
        div_profiles = list(session.exec(
            select(CrackModeProfile)
            .where(CrackModeProfile.division == division)
            .order_by(CrackModeProfile.performance_score.desc())
        ).all())
        
        for rank, profile in enumerate(div_profiles, start=1):
            profile.division_rank = rank
    
    session.commit()
    print("✅ Weekly division update complete!")


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


def weekly_system_update(session: Session):
    """
    🎮 WEEKLY CRON JOB
    
    Run every Sunday at midnight:
    1. Update division rankings (promote/relegate based on performance_score)
    2. Update global rankings (for leaderboard display)
    
    This is the core of the FIFA system!
    """
    print("🎮 === WEEKLY SYSTEM UPDATE STARTING ===")
    
    # Step 1: Update division rankings (FIFA system)
    update_division_rankings(session)
    
    # Step 2: Update global rankings (for display)
    update_global_rankings(session)
    
    print("🎮 === WEEKLY SYSTEM UPDATE COMPLETE ===")
