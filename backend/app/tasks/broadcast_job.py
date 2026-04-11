"""
Broadcast job — daily community engagement schedule:

  8:00am  → 📚 Topic lesson + LeetCode problem
  12:00pm → 🏆 Midday leaderboard shoutouts (live DB)
  6:00pm  → 💡 Problem solution + explanation
  9:00pm  → 🔥 Evening streak/activity callout
"""

import asyncio
from datetime import datetime, timezone
from app.core.db import get_session
from app.whatsapp.services.broadcast_service import (
    generate_morning_lesson_and_problem,
    generate_midday_leaderboard,
    generate_evening_solution,
    generate_evening_streak_callout,
    send_whatsapp_message,
)
from app.whatsapp.contents.topics import get_daily_topic  # fixed import path

_last_sent: dict[str, str] = {}


def _already_sent(key: str) -> bool:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return _last_sent.get(key) == today


def _mark_sent(key: str):
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    _last_sent[key] = today


async def broadcast_job():
    await asyncio.sleep(15)
    print("📡 Broadcast job started")

    while True:
        try:
            now = datetime.now(timezone.utc)
            hour = now.hour
            minute = now.minute
            today_key = now.strftime("%Y-%m-%d")

            # ── 8am EAT = 5am UTC ─────────────────────────────────────────────
            if hour == 5 and minute < 5 and not _already_sent(f"morning_{today_key}"):
                print("📚 Sending morning lesson...")
                topic = get_daily_topic()
                message = await generate_morning_lesson_and_problem(topic)
                await send_whatsapp_message(message)
                _mark_sent(f"morning_{today_key}")
                print("✅ Morning lesson sent")

            # ── 12pm EAT = 9am UTC ────────────────────────────────────────────
            elif hour == 9 and minute < 5 and not _already_sent(f"midday_{today_key}"):
                print("🏆 Sending midday leaderboard...")
                with next(get_session()) as session:
                    message = await generate_midday_leaderboard(session)
                await send_whatsapp_message(message)
                _mark_sent(f"midday_{today_key}")
                print("✅ Midday leaderboard sent")

            # ── 6pm EAT = 3pm UTC ─────────────────────────────────────────────
            elif hour == 15 and minute < 5 and not _already_sent(f"evening_{today_key}"):
                print("💡 Sending evening solution...")
                topic = get_daily_topic()
                message = await generate_evening_solution(topic)
                await send_whatsapp_message(message)
                _mark_sent(f"evening_{today_key}")
                print("✅ Evening solution sent")

            # ── 9pm EAT = 6pm UTC ─────────────────────────────────────────────
            elif hour == 18 and minute < 5 and not _already_sent(f"night_{today_key}"):
                print("🔥 Sending night callout...")
                with next(get_session()) as session:
                    message = await generate_evening_streak_callout(session)
                await send_whatsapp_message(message)
                _mark_sent(f"night_{today_key}")
                print("✅ Night callout sent")

        except Exception as e:
            print(f"❌ Broadcast job error: {e}")

        await asyncio.sleep(60)  # check every 1 min (tighter window)