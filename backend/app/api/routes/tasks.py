from fastapi import APIRouter, HTTPException
from app.api.deps import SessionDep, CurrentUser
from app import crud
from app.models import SyncTask
from sqlmodel import SQLModel
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/tasks", tags=["tasks"])


class SyncTaskPublic(SQLModel):
    id: str
    task_type: str
    status: str
    total_profiles: int
    synced_count: int
    failed_count: int
    error: Optional[str] = None
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


@router.get("/sync/latest", response_model=SyncTaskPublic)
async def get_latest_sync_status(session: SessionDep):
    """
    Returns the most recent daily sync task.
    Useful for checking whether the nightly job is running, done, or failed.
    No auth required — this is public status info.
    """
    task = crud.get_latest_sync_task(session, task_type="daily_sync")
    if not task:
        raise HTTPException(status_code=404, detail="No sync tasks found yet.")
    return task


@router.get("/sync/{task_id}", response_model=SyncTaskPublic)
async def get_sync_task(task_id: str, session: SessionDep):
    """
    Returns a specific sync task by ID.
    """
    task = crud.get_sync_task(session, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    return task
