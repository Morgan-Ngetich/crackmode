from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime, timezone
from .public import CrackModeProfilePublic

if TYPE_CHECKING:
    from .users import User
    

class CrackModeProfile(SQLModel, table=True):
    """
    🎮 FIFA-STYLE DIVISION SYSTEM
    
    Division is based on PERFORMANCE SCORE (recent velocity), not all-time stats
    """
    
    __tablename__ = "crackmode_profiles"
    
    id: int = Field(primary_key=True)
    user_id: int = Field(foreign_key="users.id", unique=True, index=True)
    
    # LeetCode identity
    leetcode_username: str = Field(unique=True, index=True)

    total_easy: int = 0
    total_medium: int = 0
    total_hard: int = 0
    total_problems_solved: int = 0

    weekly_easy: int = 0
    weekly_medium: int = 0
    weekly_hard: int = 0
    weekly_total: int = 0
    weekly_stats_updated_at: datetime | None = None

    monthly_easy: int = 0
    monthly_medium: int = 0
    monthly_hard: int = 0
    monthly_total: int = 0
    monthly_stats_updated_at: datetime | None = None
    
    difficulty_points: int = 0  # All-time: easy*1 + medium*3 + hard*5
    streak_bonus: int = 0
    weekly_bonus: int = 0
    contest_bonus: int = 0
    total_score: int = 0  # All-time total score (for leaderboard display)
    
    performance_score: int = 0  # Based on weekly velocity + monthly consistency
    
    division: str = "Bronze"  # Bronze, Silver, Gold, Platinum, Diamond
    rank: int = 0  # Global rank (based on total_score for display)
    division_rank: int = 0  # Rank within division (based on performance_score)
    season: str = "Season 1"
    
    current_streak: int = 0
    longest_streak: int = 0
    
    weekly_solves: int = 0  # Problems solved THIS week

    contest_rating: int = 0
    contest_ranking: int | None = None

    last_synced: datetime | None = None
    sync_error: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    user: Optional["User"] = Relationship(back_populates="crackmode_profile")
    
    def to_public(self):
        """Convert to public representation"""
        from .public import CrackModeProfilePublic
        
        return CrackModeProfilePublic(
            id=self.id,
            user_id=self.user_id,
            leetcode_username=self.leetcode_username,
            
            # All-time stats
            total_easy=self.total_easy,
            total_medium=self.total_medium,
            total_hard=self.total_hard,
            total_problems_solved=self.total_problems_solved,
            
            # Division & ranking
            division=self.division,
            rank=self.rank,
            division_rank=self.division_rank,
            season=self.season,
            
            # Scores
            total_score=self.total_score,
            performance_score=self.performance_score,
            
            # Streaks
            current_streak=self.current_streak,
            longest_streak=self.longest_streak,
            
            # Weekly
            weekly_solves=self.weekly_solves,
            
            # Contest
            contest_rating=self.contest_rating,
            
            # Metadata
            last_synced=self.last_synced,
            created_at=self.created_at,
            updated_at=self.updated_at,
        )


class CrackModeSetupRequest(SQLModel):
    """Request model for setting up CrackMode"""
    leetcode_username: str


class LeaderboardResponse(SQLModel):
    """Response model for leaderboard"""
    profiles: list[CrackModeProfilePublic]
    total: int
    division: str | None = None
    season: str | None = None