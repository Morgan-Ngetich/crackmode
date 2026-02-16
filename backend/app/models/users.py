# app/models/user.py

from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING
from enum import Enum
from app.core.config import settings
from pydantic import BaseModel

if TYPE_CHECKING:
    from .crackmode_profile import CrackModeProfile


class UserRole(str, Enum):
    """User roles for access control"""
    USER = "user"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


class User(SQLModel, table=True):
    """Minimal user model - just auth basics"""

    __tablename__ = "users"

    id: int = Field(primary_key=True)
    uuid: UUID = Field(default_factory=uuid4, unique=True, index=True)
    email: str = Field(unique=True, index=True)
    full_name: str | None = None
    avatar_url: str | None = None
    is_active: bool = True
    role: UserRole = Field(default=UserRole.USER, sa_column_kwargs={"nullable": False})

    # Extended profile fields (synced from LeetCode when user sets up CrackMode)
    github_url: str | None = None
    twitter_url: str | None = None
    linkedin_url: str | None = None
    website_url: str | None = None  # Store first website from list
    country: str | None = None
    company: str | None = None
    school: str | None = None
    about: str | None = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # CrackMode relationship
    crackmode_profile: Optional["CrackModeProfile"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"uselist": False}
    )

    def is_admin(self) -> bool:
        """Check if user has admin privileges"""
        return self.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]

    def is_super_admin(self) -> bool:
        """Check if user is a super admin"""
        return self.role == UserRole.SUPER_ADMIN

    def to_public(self):
        """Convert to public representation"""
        from .public.user_public import UserPublic

        return UserPublic(
            id=self.id,
            uuid=str(self.uuid),
            full_name=self.full_name,
            email=self.email,
            avatar_url=self.avatar_url or settings.DEFAULT_AVATAR_URL,
            is_active=self.is_active,
            role=self.role.value,
            github_url=self.github_url,
            twitter_url=self.twitter_url,
            linkedin_url=self.linkedin_url,
            website_url=self.website_url,
            country=self.country,
            company=self.company,
            school=self.school,
            about=self.about,
            crackmode_profile=self.crackmode_profile.to_public()
            if self.crackmode_profile
            else None,
            created_at=self.created_at,
            updated_at=self.updated_at,
        )


class UserSyncIn(BaseModel):
    user_id: UUID
    email: str
    full_name: str | None = None
    avatar_url: str | None = None


class UserRoleUpdate(BaseModel):
    """Schema for updating user role (admin only)"""
    role: UserRole