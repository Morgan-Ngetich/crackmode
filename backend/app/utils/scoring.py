"""
FIFA-STYLE PERFORMANCE SCORING SYSTEM

Division is determined by PERFORMANCE SCORE, not all-time stats.
Performance score is based on:
- 65% THIS WEEK'S grinding          ← raised from 60% to reward current hustle more
- 25% THIS MONTH'S consistency      ← lowered from 30% so one bad week hurts more
- 10% All-time legacy bonus (capped)
- Streak multiplier (reward daily grind)
- Activity multiplier (punish inactivity harder)

Competition philosophy: "What have you done THIS WEEK?" is the primary question.
"""

from app.models import CrackModeProfile


def calculate_performance_score(
    profile: CrackModeProfile,
    weekly_stats: dict,
    monthly_stats: dict,
) -> int:

    # ===== 65% WEIGHT: THIS WEEK'S GRIND =====
    weekly_points = (
        weekly_stats.get("easy", 0) * 1 +
        weekly_stats.get("medium", 0) * 3 +
        weekly_stats.get("hard", 0) * 5
    ) * 0.65

    # ===== 25% WEIGHT: MONTHLY AVERAGE PER WEEK =====
    monthly_total_points = (
        monthly_stats.get("easy", 0) * 1 +
        monthly_stats.get("medium", 0) * 3 +
        monthly_stats.get("hard", 0) * 5
    )
    monthly_avg_weekly = (monthly_total_points / 4) * 0.25

    # ===== 10% WEIGHT: LEGACY BONUS =====
    legacy_bonus = min(profile.total_score * 0.001, 100)

    base_score = weekly_points + monthly_avg_weekly + legacy_bonus

    # ===== STREAK MULTIPLIER =====
    # 0.025 per day (up from 0.02) — daily grinders get a bigger edge
    # Cap stays at 60% boost (reached at 24 days instead of 30)
    streak_multiplier = 1.0 + min(profile.current_streak * 0.025, 0.6)

    # ===== INACTIVITY PENALTY (GRADUATED) =====
    # 0 problems/week = 0.4x  (was 0.5x — harsher to discourage ghosting)
    # 1-2 problems/week = 0.70x  (was 0.75x)
    # 3-4 problems/week = 0.90x  (unchanged)
    # 5+  problems/week = 1.0x   (no penalty)
    weekly_total = weekly_stats.get("total", 0)

    if weekly_total == 0:
        activity_multiplier = 0.4        # Ghosting is punished hard
    elif weekly_total < 3:
        activity_multiplier = 0.70       # Very low — danger zone
    elif weekly_total < 5:
        activity_multiplier = 0.90       # Mild dip
    else:
        activity_multiplier = 1.0        # Healthy — no penalty

    final_score = base_score * streak_multiplier * activity_multiplier

    return int(final_score)


def get_division_thresholds() -> dict:
    """
    Division thresholds based on performance score.

    These are VELOCITY thresholds — not total problems solved,
    but how hard you're grinding RIGHT NOW.

    Tweaked for tighter competition spread:
      Bronze  → just starting out
      Silver  → ~4 problems/week consistently
      Gold    → ~8-10 problems/week consistently
      Platinum→ ~18-20 problems/week consistently
      Diamond → ~28+ problems/week consistently
    """
    return {
        "Bronze":   0,
        "Silver":   12,    # Slightly easier to hit Silver (was 15)
        "Gold":     38,    # Tightened (was 40) — Gold is earned
        "Platinum": 75,    # Tightened (was 80) — more Platinum competition
        "Diamond":  140,   # Tightened (was 150) — top tier is reachable
    }


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
    # Example: Gold floor is 38. Drop below 30.4 (38 × 0.8) to get relegated.
    current_index = order.index(current_division)

    if current_index == 0:  # Already Bronze — can't go lower
        return "Bronze"

    current_floor = thresholds[current_division]
    relegation_threshold = current_floor * 0.8

    if performance_score >= relegation_threshold:
        # Still within safe zone — stay in current division
        return current_division

    # Fell through the buffer — relegate one division
    return order[current_index - 1]


def calculate_weekly_velocity(profile: CrackModeProfile) -> float:
    """Problems solved this week — shown in UI as grinding velocity."""
    return profile.weekly_total


def is_user_inactive(profile: CrackModeProfile) -> bool:
    """Inactive = 0 problems in the last 7 days."""
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
        points_to_drop   = int(profile.performance_score - relegation_threshold)

        if points_to_drop <= 0:
            return f"🔴 Relegation imminent! Solve problems NOW to stay in {profile.division}."
        elif points_to_drop < 10:
            return f"🟠 Danger zone! {points_to_drop} pts from relegation. Keep grinding!"
        else:
            return f"🟡 Below {profile.division} floor. {points_to_safety} pts to reclaim your standing."

    return None
