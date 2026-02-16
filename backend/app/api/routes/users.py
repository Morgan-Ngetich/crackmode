from fastapi import APIRouter, HTTPException, Depends, status
from app.api.deps import SessionDep, CurrentUser, CurrentAdmin
from app.models import UserSyncIn, UserRoleUpdate
from app.models.public.user_public import UserPublic
from app import crud
from app.tasks.sync import sync_user_from_supabase_task
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["users"])


class DeleteResponse(BaseModel):
    """Response for deletion operations"""
    message: str
    user_id: int


@router.post("/sync", response_model=UserPublic)
async def sync_user(
    user_sync_in: UserSyncIn,
    current_user: CurrentUser,
    session: SessionDep
) -> UserPublic:
    """
    Sync user from Supabase to local database
    
    This endpoint:
    1. Verifies the user is syncing their own profile
    2. Checks if user exists by email
    3. Creates or updates user record
    4. Returns the synced user data
    """
    
    # Security check: user can only sync their own profile
    if current_user.uuid != user_sync_in.user_id:
        raise HTTPException(
            status_code=403,
            detail="You can only sync your own profile"
        )
    
    # Check if user with this email already exists
    existing_user = crud.get_user_by_email(session, user_sync_in.email)
    
    if existing_user:
        # User exists - check if UUID matches
        if str(existing_user.uuid) != str(user_sync_in.user_id):
            raise HTTPException(
                status_code=409,
                detail="User with this email already exists with different UUID"
            )
        
        # Update existing user's info
        updated_user = crud.update_synced_user_info(
            session,
            existing_user,
            email=user_sync_in.email,
            full_name=user_sync_in.full_name,
            avatar_url=user_sync_in.avatar_url,
        )
        return updated_user.to_public()
    
    # New user - trigger background sync task
    sync_user_from_supabase_task(
        user_id=str(user_sync_in.user_id),
        email=user_sync_in.email,
        full_name=user_sync_in.full_name,
        avatar_url=user_sync_in.avatar_url,
    )
    
    return current_user.to_public()


@router.get("/me", response_model=UserPublic)
async def get_current_user_info(
    current_user: CurrentUser,
) -> UserPublic:
    """
    Get current authenticated user's information
    
    Returns full user profile including CrackMode profile if it exists
    """
    return current_user.to_public()


@router.get("/{user_id}", response_model=UserPublic)
async def get_user_by_id(
    user_id: int,
    session: SessionDep,
) -> UserPublic:
    """
    Get user by ID (public endpoint)
    
    Returns user profile with public information
    """
    user = crud.get_user_by_id(session, user_id)
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    return user.to_public()


@router.get("/uuid/{user_uuid}", response_model=UserPublic)
async def get_user_by_uuid(
    user_uuid: str,
    session: SessionDep,
) -> UserPublic:
    """
    Get user by UUID (public endpoint)
    
    Useful for linking users across different services
    """
    from uuid import UUID
    
    try:
        uuid_obj = UUID(user_uuid)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid UUID format"
        )
    
    user = crud.get_user_by_uuid(session, uuid_obj)
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    return user.to_public()


@router.patch("/me", response_model=UserPublic)
async def update_current_user(
    user_update: dict,
    current_user: CurrentUser,
    session: SessionDep,
) -> UserPublic:
    """
    Update current user's basic information
    
    Allowed fields: full_name, avatar_url
    """
    
    allowed_fields = {"full_name", "avatar_url"}
    update_data = {k: v for k, v in user_update.items() if k in allowed_fields}
    
    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="No valid fields to update"
        )
    
    # Update user
    for key, value in update_data.items():
        setattr(current_user, key, value)
    
    from datetime import datetime, timezone
    current_user.updated_at = datetime.now(timezone.utc)
    
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    
    return current_user.to_public()


@router.delete("/me", response_model=DeleteResponse)
async def delete_current_user_account(
    current_user: CurrentUser,
    session: SessionDep,
) -> DeleteResponse:
    """
    Delete current user's account
    
    This will:
    1. Soft delete by setting is_active=False (recommended)
    OR
    2. Hard delete from database (uncomment the hard delete code)
    
    TODO: Consider implementing a grace period before actual deletion
    """
    
    user_id = current_user.id
    
    # Option 1: Soft delete (recommended - allows account recovery)
    current_user.is_active = False
    from datetime import datetime, timezone
    current_user.updated_at = datetime.now(timezone.utc)
    session.add(current_user)
    session.commit()
    
    # Option 2: Hard delete (uncomment if you want permanent deletion)
    # session.delete(current_user)
    # session.commit()
    
    return DeleteResponse(
        message="Account successfully deleted",
        user_id=user_id
    )


@router.delete("/{user_id}", response_model=DeleteResponse)
async def delete_user_by_admin(
    user_id: int,
    current_admin: CurrentAdmin,
    session: SessionDep,
) -> DeleteResponse:
    """
    Delete a user account (Admin only)
    
    Admins can delete any user account.
    This performs a soft delete by setting is_active=False
    """
    
    user = crud.get_user_by_id(session, user_id)
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Prevent admins from deleting super admins (unless they are super admin themselves)
    if user.is_super_admin() and not current_admin.is_super_admin():
        raise HTTPException(
            status_code=403,
            detail="Cannot delete super admin accounts"
        )
    
    # Prevent self-deletion via admin endpoint
    if user.id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="Use DELETE /users/me to delete your own account"
        )
    
    # Soft delete
    user.is_active = False
    from datetime import datetime, timezone
    user.updated_at = datetime.now(timezone.utc)
    session.add(user)
    session.commit()
    
    return DeleteResponse(
        message=f"User {user.email} successfully deleted",
        user_id=user_id
    )


@router.patch("/{user_id}/role", response_model=UserPublic)
async def update_user_role(
    user_id: int,
    role_update: UserRoleUpdate,
    current_admin: CurrentAdmin,
    session: SessionDep,
) -> UserPublic:
    """
    Update a user's role (Admin only)
    
    Admins can promote users to admin or demote them to regular users.
    Only super admins can create other super admins.
    """
    
    user = crud.get_user_by_id(session, user_id)
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Prevent self-role modification
    if user.id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot modify your own role"
        )
    
    # Only super admins can create other super admins
    from app.models import UserRole
    if role_update.role == UserRole.SUPER_ADMIN and not current_admin.is_super_admin():
        raise HTTPException(
            status_code=403,
            detail="Only super admins can create other super admins"
        )
    
    # Only super admins can modify other super admins
    if user.is_super_admin() and not current_admin.is_super_admin():
        raise HTTPException(
            status_code=403,
            detail="Only super admins can modify other super admin accounts"
        )
    
    # Update role
    user.role = role_update.role
    from datetime import datetime, timezone
    user.updated_at = datetime.now(timezone.utc)
    
    session.add(user)
    session.commit()
    session.refresh(user)
    
    return user.to_public()