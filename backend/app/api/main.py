from fastapi import APIRouter

from app.api.routes import (
    crackmode,
    users,
    auth
)

from app.api.routes.crackmode_og import og


api_router = APIRouter()

api_router.include_router(og.router, tags=["crackmode"])

# Auth (no prefix conflict)
api_router.include_router(
    auth.router,
    prefix="/auth",
)

# Users
api_router.include_router(
    users.router,
)

# Crackmode
api_router.include_router(
    crackmode.router,
)
