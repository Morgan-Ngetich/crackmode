import traceback
from app.tasks.broadcast_job import broadcast_job
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
    await asyncio.sleep(10)   # let the app fully boot before first run
    while True:
        task_record = None
        try:
            print(f"🔄 Starting daily sync at {datetime.now(timezone.utc)}")

            with next(get_session()) as session:
                # Create a DB record so we can inspect sync status via API
                task_record = crud.create_sync_task(session, task_type="daily_sync")
                profiles = crud.get_all_crackmode_profiles(session)

                crud.update_sync_task(
                    session, task_record,
                    status="running",
                    total_profiles=len(profiles),
                    started_at=datetime.now(timezone.utc),
                )

  
                # Semaphore caps concurrent tasks — rate limiter handles the
                # 90/hour budget; this caps how many tasks are alive at once.
                # 15 concurrent × 2 calls each = 30 slots competing for the
                # rate limiter, which is fine — extras just queue.
                sem = asyncio.Semaphore(15)

                async def _sync(p):
                    async with sem:
                        return await sync_profile(session, p)

                results = await asyncio.gather(
                    *[_sync(p) for p in profiles],
                    return_exceptions=True,
                )

                synced = sum(1 for r in results if r is True)
                failed = len(results) - synced

                crud.update_global_rankings(session)
                crud.update_division_rankings(session)

                crud.update_sync_task(
                    session, task_record,
                    status="done",
                    synced_count=synced,
                    failed_count=failed,
                    completed_at=datetime.now(timezone.utc),
                )
                print(f"✅ Daily sync complete — {synced} synced, {failed} failed")

        except Exception as e:
            print(f"❌ Daily sync job crashed: {e}")
            traceback.print_exc()
            # Mark the task as failed if we got far enough to create one
            if task_record is not None:
                try:
                    with next(get_session()) as session:
                        task_record = crud.get_sync_task(session, task_record.id)
                        if task_record:
                            crud.update_sync_task(
                                session, task_record,
                                status="failed",
                                error=str(e)[:500],
                                completed_at=datetime.now(timezone.utc),
                            )
                except Exception:
                    pass

        await asyncio.sleep(60 * 60 * 24)


@asynccontextmanager
async def lifespan(app: FastAPI):
    task1 = asyncio.create_task(daily_sync_job())
    task2 = asyncio.create_task(broadcast_job())   # ← add this
    yield
    task1.cancel()
    task2.cancel()
    try:
        await asyncio.gather(task1, task2, return_exceptions=True)
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
        