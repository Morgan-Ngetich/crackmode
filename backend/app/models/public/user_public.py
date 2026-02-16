from sqlmodel import SQLModel
from typing import Optional, List
from datetime import datetime


class UserPublic(SQLModel):
    """Minimal user info for nested responses"""

    id: int
    uuid: str
    full_name: str
    email: str
    avatar_url: Optional[str] = None
    role: str

    # Extended profile fields (from LeetCode)
    github_url: str | None = None
    twitter_url: str | None = None
    linkedin_url: str | None = None
    website_url: str | None = None
    country: str | None = None
    company: str | None = None
    school: str | None = None
    about: str | None = None

    crackmode_profile: Optional["CrackModeProfilePublic"] = None

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class CrackModeSetupRequest(SQLModel):
    leetcode_username: str


class CrackModeProfilePublic(SQLModel):
    """Public representation of CrackMode profile"""
    
    id: int
    user_id: int
    leetcode_username: str
    
    # All-time stats
    total_easy: int
    total_medium: int
    total_hard: int
    total_problems_solved: int
    
    # Division & ranking
    division: str
    rank: int
    division_rank: int
    season: str
    
    # Scores
    total_score: int
    performance_score: int
    
    # Streaks
    current_streak: int
    longest_streak: int
    
    # Weekly
    weekly_solves: int
    
    # Contest
    contest_rating: int
    
    # Metadata
    last_synced: datetime | None
    created_at: datetime
    updated_at: datetime


class LeaderboardResponse(SQLModel):
    profiles: List[CrackModeProfilePublic]
    total: int
    division: Optional[str] = None
    season: Optional[str] = None
