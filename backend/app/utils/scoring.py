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


# scoring.py

def calculate_performance_score(
    profile: CrackModeProfile,
    weekly_stats: dict,
    monthly_stats: dict,
) -> int:
    
    # ===== 60% WEIGHT: THIS WEEK'S GRIND =====
    weekly_points = (
        weekly_stats.get("easy", 0) * 1 +
        weekly_stats.get("medium", 0) * 3 +
        weekly_stats.get("hard", 0) * 5
    ) * 0.6

    # ===== 30% WEIGHT: MONTHLY AVERAGE PER WEEK =====
    monthly_total_points = (
        monthly_stats.get("easy", 0) * 1 +
        monthly_stats.get("medium", 0) * 3 +
        monthly_stats.get("hard", 0) * 5
    )
    monthly_avg_weekly = (monthly_total_points / 4) * 0.3

    # ===== 10% WEIGHT: LEGACY BONUS =====
    legacy_bonus = min(profile.total_score * 0.001, 100)

    base_score = weekly_points + monthly_avg_weekly + legacy_bonus

    # ===== STREAK MULTIPLIER =====
    streak_multiplier = 1.0 + min(profile.current_streak * 0.02, 0.6)

    # ===== INACTIVITY PENALTY (GRADUATED, not binary) =====
    # Instead of a hard 50% cliff, penalty scales with how inactive they are
    weekly_total = weekly_stats.get("total", 0)
    
    if weekly_total == 0:
        activity_multiplier = 0.5       # Zero activity — harsh but fair
    elif weekly_total < 3:
        activity_multiplier = 0.75      # Very low — warning territory  
    elif weekly_total < 5:
        activity_multiplier = 0.90      # Mild dip
    else:
        activity_multiplier = 1.0       # Healthy — no penalty

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


# scoring.py

def determine_division_by_score(performance_score: int, current_division: str = None) -> str:
    """
    Determine division based on performance score.
    
    If current_division is provided, applies a relegation buffer (hysteresis):
    - You must fall 20% BELOW the division floor to get relegated
    - You must reach the FULL threshold to get promoted
    - This prevents yo-yo divisions from minor score fluctuations
    """
    thresholds = get_division_thresholds()
    order = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"]
    
    # ===== PROMOTION: Must hit full threshold (no leniency) =====
    if performance_score >= thresholds["Diamond"]:
        return "Diamond"
    elif performance_score >= thresholds["Platinum"]:
        return "Platinum"
    elif performance_score >= thresholds["Gold"]:
        return "Gold"
    elif performance_score >= thresholds["Silver"]:
        return "Silver"
    else:
        promoted_division = "Bronze"
    
    # If no current division provided, return raw result (e.g. on setup)
    if not current_division:
        return promoted_division
    
    # ===== RELEGATION: Must fall 20% below current floor =====
    # Example: Gold floor is 40. You must drop below 32 (40 * 0.8) to be relegated.
    # This gives a "safe zone" inside each division.
    current_index = order.index(current_division)
    
    if current_index == 0:  # Already Bronze, can't relegate further
        return "Bronze"
    
    current_floor = thresholds[current_division]
    relegation_threshold = current_floor * 0.8  # 20% buffer below floor
    
    if performance_score >= relegation_threshold:
        # Still within safe zone — stay in current division
        return current_division
    
    # Fell through the buffer — relegate one division
    return order[current_index - 1]


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
    thresholds = get_division_thresholds()
    order = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"]
    
    if profile.division == "Bronze":
        return None  # Can't go lower
    
    current_floor = thresholds[profile.division]
    relegation_threshold = current_floor * 0.8
    
    if profile.performance_score < current_floor:
        points_to_safety = int(current_floor - profile.performance_score)
        points_to_drop = int(profile.performance_score - relegation_threshold)
        
        if points_to_drop <= 0:
            return f"🔴 Relegation imminent! Solve problems NOW to stay in {profile.division}."
        elif points_to_drop < 10:
            return f"🟠 Danger zone! {points_to_drop} pts from relegation. Keep grinding!"
        else:
            return f"🟡 Below {profile.division} floor. {points_to_safety} pts to reclaim your standing."
    
    return None