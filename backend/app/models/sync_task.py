from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone
from uuid import uuid4


class SyncTask(SQLModel, table=True):
    """
    Tracks the state of background sync jobs.

    Used for both:
    - Daily batch sync (task_type="daily_sync")
    - Individual profile syncs triggered by API (task_type="profile_sync")

    Gives observability into what the sync job is doing without Celery.
    """

    __tablename__ = "sync_tasks"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    task_type: str = "daily_sync"           # "daily_sync" | "profile_sync"
    status: str = "pending"                 # "pending" | "running" | "done" | "failed"

    # Progress tracking
    total_profiles: int = 0
    synced_count: int = 0
    failed_count: int = 0

    # Optional: which user triggered this (for profile_sync tasks)
    triggered_by_user_id: Optional[int] = None

    # Error message if the whole job crashes
    error: Optional[str] = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
