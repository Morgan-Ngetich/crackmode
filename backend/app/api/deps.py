from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlmodel import Session, select
from typing import Annotated, Optional
from app.core.db import get_session
from app.core import security
from app.core.config import settings
from app.models import User
from app import crud
from datetime import datetime

SessionDep = Annotated[Session, Depends(get_session)]
TokenDep = Annotated[str, Depends(security.oauth2_scheme)]
BearerDep = Annotated[HTTPAuthorizationCredentials, Depends(security.bearer_scheme)]

TokenDepOptional = Annotated[Optional[str], Depends(security.oauth2_scheme_optional)]
BearerDepOptional = Annotated[Optional[HTTPAuthorizationCredentials], Depends(security.bearer_scheme_optional)]

def get_current_user(
    session: SessionDep,
    form_token: TokenDep = None,
    bearer_token: BearerDep = None,
) -> User:
    print(f"Received Bearer Token: {bearer_token}")
    token = bearer_token.credentials if bearer_token else form_token

    if not token:
        raise HTTPException(status_code=403, detail="No credentials provided")

    # Local override
    # "dev-admin" should'nt be set in the settings, as it's not needed within the prod variables.
    if settings.ENVIRONMENT == "local" and token == "dev-admin":
        user = session.exec(select(User).where(User.email == settings.FIRST_SUPERUSER)).first()
        if not user:
            raise HTTPException(status_code=404, detail="Dev admin user not found")
        return user

    try:
        print(f"🔐 Attempting to decode token: {token[:50]}...")
        payload = security.decode_token(token)
        print(f"✅ Token decoded successfully: {payload}")
        
        user_id = payload.get("sub")
        email = payload.get("email")
        avatar_url = payload.get("avatar_url", settings.DEFAULT_AVATAR_URL)
        full_name = payload.get("user_metadata", {}).get("full_name"
            or payload.get("full_name")
            or email.split("@")[0])
        if not user_id:
            raise HTTPException(status_code=403, detail="Token missing subject")
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Invalid credentials: {e}")

    user = crud.get_user_by_identifier(session, user_id)

    if not user and email:
        print(f"➕ Creating new user: {email}")
        user = crud.create_user_from_supabase(session, user_id, email, full_name, avatar_url)
    elif not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Inactive user")

    return user

CurrentUser = Annotated[User, Depends(get_current_user)]

def get_current_admin_user(
    current_user: CurrentUser,
) -> User:
    """
    Dependency to ensure current user is an admin
    """
    if not current_user.is_admin():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user


def get_current_super_admin_user(
    current_user: CurrentUser,
) -> User:
    """
    Dependency to ensure current user is a super admin
    """
    if not current_user.is_super_admin():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin privileges required"
        )
    return current_user



CurrentAdmin = Annotated[User, Depends(get_current_admin_user)]
CurrentSuperAdmin = Annotated[User, Depends(get_current_super_admin_user)]