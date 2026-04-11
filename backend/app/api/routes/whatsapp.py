"""
WhatsApp broadcast test endpoints — local/dev use only.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.core.db import get_session
from app.core.config import settings
from app.whatsapp.contents.topics import get_daily_topic
from app.whatsapp.services.broadcast_service import (
    generate_morning_lesson_and_problem,
    generate_midday_leaderboard,
    generate_evening_solution,
    generate_evening_streak_callout,
    send_whatsapp_message,
)

router = APIRouter(prefix="/whatsapp", tags=["whatsapp"])


def _dev_only():
    if settings.ENVIRONMENT not in ("local", "staging"):
        raise HTTPException(status_code=403, detail="Only available in local/staging")


@router.post("/test/morning")
async def test_morning():
    _dev_only()
    topic = get_daily_topic()
    message = await generate_morning_lesson_and_problem(topic)
    await send_whatsapp_message(message)
    return {"sent": True, "preview": message}


@router.post("/test/midday")
async def test_midday(session: Session = Depends(get_session)):
    _dev_only()
    message = await generate_midday_leaderboard(session)
    await send_whatsapp_message(message)
    return {"sent": True, "preview": message}


@router.post("/test/evening")
async def test_evening():
    _dev_only()
    topic = get_daily_topic()
    message = await generate_evening_solution(topic)
    await send_whatsapp_message(message)
    return {"sent": True, "preview": message}


@router.post("/test/night")
async def test_night(session: Session = Depends(get_session)):
    _dev_only()
    message = await generate_evening_streak_callout(session)
    await send_whatsapp_message(message)
    return {"sent": True, "preview": message}


@router.post("/test/send")
async def test_send_raw(body: dict):
    """Send a raw text message to the group — useful for smoke testing the Green API connection."""
    _dev_only()
    text = body.get("message", "Test from CrackMode backend 🚀")
    await send_whatsapp_message(text)
    return {"sent": True}
