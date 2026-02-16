"""
Central export point for all models.
Import everything here and re-export for easy access.
"""

# Step 1: Import enums and base classes (no dependencies)

# Step 2: Import ORM models (database tables)
from .users import (
    User,
    UserRole,
    UserRoleUpdate,
    UserSyncIn,
)
from .crackmode_profile import (
    CrackModeProfile,
)

# Step 3: Import public models (DTOs) - AFTER all ORM models
from .public import (
    UserPublic,
    CrackModeSetupRequest,
    CrackModeProfilePublic,
    LeaderboardResponse
)

# Step 4: Rebuild all public models to resolve forward references
# This MUST happen AFTER all ORM models are imported

UserPublic.model_rebuild()

__all__ = [
    "UserPublic",
    "User",
    "UserRole",
    "UserRoleUpdate",
    "UserSyncIn",
    "CrackModeProfile",
    "CrackModeSetupRequest",
    "CrackModeProfilePublic",
    "LeaderboardResponse"
]