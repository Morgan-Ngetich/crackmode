"""
FIFA-STYLE PERFORMANCE SCORING SYSTEM

Division is determined by PERFORMANCE SCORE, not all-time stats.
Performance score is based on:
- 60% THIS WEEK'S grinding
- 30% THIS MONTH'S consistency  
- 10% All-time legacy bonus (capped)
- Streak multiplier (reward daily consistency)

This ensures: "Keep grinding or get relegated"
"""

from app.models import CrackModeProfile


def calculate_performance_score(
    profile: CrackModeProfile,
    weekly_stats: dict,
    monthly_stats: dict,
) -> int:
    """
    Calculate FIFA-style performance score
    
    Args:
        profile: User's CrackMode profile
        weekly_stats: Dict with {easy, medium, hard, total} for last 7 days
        monthly_stats: Dict with {easy, medium, hard, total} for last 30 days
    
    Returns:
        Performance score (determines division placement)
    """
    
    # ===== 60% WEIGHT: THIS WEEK'S GRIND =====
    weekly_points = (
        weekly_stats.get("easy", 0) * 1 +
        weekly_stats.get("medium", 0) * 3 +
        weekly_stats.get("hard", 0) * 5
    ) * 0.6
    
    # ===== 30% WEIGHT: THIS MONTH'S AVERAGE PER WEEK =====
    monthly_total_points = (
        monthly_stats.get("easy", 0) * 1 +
        monthly_stats.get("medium", 0) * 3 +
        monthly_stats.get("hard", 0) * 5
    )
    monthly_avg_weekly = (monthly_total_points / 4) * 0.3  # Divide by 4 weeks
    
    # ===== 10% WEIGHT: ALL-TIME LEGACY BONUS (CAPPED AT 100) =====
    legacy_bonus = min(profile.total_score * 0.001, 100)
    
    # ===== BASE SCORE =====
    base_score = weekly_points + monthly_avg_weekly + legacy_bonus
    
    # ===== STREAK MULTIPLIER (Reward daily consistency) =====
    # +2% per day of streak, capped at 60% bonus (30-day streak)
    streak_multiplier = 1.0 + min(profile.current_streak * 0.02, 0.6)
    
    # ===== INACTIVITY PENALTY =====
    # If weekly_total is 0, apply 50% penalty to performance score
    activity_multiplier = 1.0 if weekly_stats.get("total", 0) > 0 else 0.5
    
    # ===== FINAL SCORE =====
    final_score = base_score * streak_multiplier * activity_multiplier
    
    return int(final_score)


def get_division_thresholds() -> dict:
    """
    🎮 Division thresholds based on performance score
    
    These are DYNAMIC thresholds - not based on total problems,
    but on CURRENT GRINDING VELOCITY
    
    Returns:
        Dict mapping division names to minimum performance scores
    """
    return {
        "Bronze": 0,
        "Silver": 15,      # ~5 problems/week consistently
        "Gold": 40,        # ~10 problems/week consistently
        "Platinum": 80,    # ~20 problems/week consistently
        "Diamond": 150,    # ~30+ problems/week consistently
    }


def determine_division_by_score(performance_score: int) -> str:
    """
    Determine division based on performance score
    
    Args:
        performance_score: User's calculated performance score
    
    Returns:
        Division name (Bronze, Silver, Gold, Platinum, Diamond)
    """
    thresholds = get_division_thresholds()
    
    if performance_score >= thresholds["Diamond"]:
        return "Diamond"
    elif performance_score >= thresholds["Platinum"]:
        return "Platinum"
    elif performance_score >= thresholds["Gold"]:
        return "Gold"
    elif performance_score >= thresholds["Silver"]:
        return "Silver"
    else:
        return "Bronze"


def calculate_weekly_velocity(profile: CrackModeProfile) -> float:
    """
    Calculate user's grinding velocity (problems per week)
    
    Used to show "You're solving X problems/week" in UI
    """
    return profile.weekly_total


def is_user_inactive(profile: CrackModeProfile) -> bool:
    """
    Check if user is considered inactive
    
    Inactive = 0 problems solved in last 7 days
    """
    return profile.weekly_total == 0


def get_relegation_warning(profile: CrackModeProfile) -> str | None:
    """
    Get warning message if user is at risk of relegation
    
    Returns warning message or None
    """
    if is_user_inactive(profile):
        return "⚠️ Inactive! Solve problems this week to avoid relegation."
    
    if profile.weekly_total < 3:
        return "⚠️ Low activity! Grind more to maintain your division."
    
    return None