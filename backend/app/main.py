from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from app.api.main import api_router
from app.core.config import settings
from app.tasks.leetcode_profile_sync import sync_profile
from app.core.db import get_session
from app import crud
from datetime import datetime, timezone
import asyncio
from contextlib import asynccontextmanager


async def daily_sync_job():
    await asyncio.sleep(10)  # let the app fully start before first sync
    while True:
        try:
            print(f"🔄 Starting daily sync at {datetime.now(timezone.utc)}")
            with next(get_session()) as session:
                profiles = crud.get_all_crackmode_profiles(session)
                synced, failed = 0, 0

                for profile in profiles:
                    success = await sync_profile(session, profile)
                    if success:
                        synced += 1
                    else:
                        failed += 1
                        print(f"⚠️ Failed to sync: {profile.leetcode_username}")
                    await asyncio.sleep(2)

                crud.update_global_rankings(session)
                crud.update_division_rankings(session)
                print(f"✅ Daily sync complete — {synced} synced, {failed} failed")

        except Exception as e:
            import traceback

            print(f"❌ Daily sync job crashed: {e}")
            traceback.print_exc()  # full stack trace for debugging

        await asyncio.sleep(60 * 60 * 24)


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(daily_sync_job())
    yield
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass


app = FastAPI(
    title=settings.PROJECT_NAME,
    docs_url=f"{settings.API_V1_STR}/docs",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=settings.PROJECT_NAME,
        version="1.0.0",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

# Allow CORS for origins
if settings.ENVIRONMENT == "local":
    origins = [
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5174",
    ]
else:
    origins = [
        "https://frontend-production-a85f.up.railway.app",
        "https://backend-production-3e33.up.railway.app",
        "https://staging-crackmode.vercel.app",
        "https://crackmode.vercel.app",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {"status": "ok"}

if settings.ENVIRONMENT == "local":
    @app.get("/debug/headers")
    async def debug_headers(request: Request):
        return {
            "authorization": request.headers.get("authorization"),
            "host": request.headers.get("host"),
            "headers": dict(request.headers),
        }
        