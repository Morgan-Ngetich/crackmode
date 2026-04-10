import httpx
import anthropic
from sqlmodel import Session
from app.core.config import settings
from app import crud
from app.whatsapp.contents.topics import get_topics_covered_summary

# AsyncAnthropic — non-blocking, won't freeze the event loop during Claude calls
_anthropic = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

DIVISION_EMOJIS = {
    "Diamond":  "💎",
    "Platinum": "🪙",
    "Gold":     "🥇",
    "Silver":   "🥈",
    "Bronze":   "🥉",
}

CATEGORY_EMOJIS = {
    "Data Structures": "🗂️",
    "Algorithms":      "⚙️",
    "System Design":   "🏗️",
}

# ── Message generators (all async — Claude calls are awaited, not blocking) ────


async def generate_morning_lesson_and_problem(topic: dict) -> str:
    category_emoji = CATEGORY_EMOJIS.get(topic["category"], "💻")
    recap = get_topics_covered_summary()  # empty string on day 1

    response = await _anthropic.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1000,
        messages=[{
            "role": "user",
            "content": f"""
You are a hype CS tutor for a competitive coding WhatsApp community called CrackMode.
Today is Day {topic['day_number']} of the curriculum.

Write a morning lesson on *{topic['topic']}* ({topic['category']}).

Structure:
1. Hook — one punchy line
2. What is {topic['topic']}? — clear, 3-4 sentences
3. Real world example — where is this used in production?
4. Key insight — the one thing to remember
5. Today's Problem — ONE real LeetCode problem that directly uses {topic['topic']}
   Format: 🟢/🟡/🔴 *Problem Name* (LeetCode #XXX) — one line focus tip

Rules:
- WhatsApp formatting ONLY (*bold*, _italic_)
- Energetic, community feel
- Max 300 words
- End with "Drop your solution at 6pm! 👇"
"""
        }]
    )

    lesson = response.content[0].text.strip()

    parts = [
        f"{category_emoji} *GOOD MORNING CRACKMODE* ☀️",
        f"_Day {topic['day_number']}: {topic['topic']} ({topic['category']})_",
        "",
        lesson,
    ]

    if recap:
        parts += ["", "─" * 20, "", recap]

    return "\n".join(parts)


async def generate_midday_leaderboard(session: Session) -> str:
    """12pm — Live leaderboard shoutouts from DB."""
    top_5          = crud.get_top_solvers_this_week(session, limit=5)
    active_today   = crud.get_most_active_today(session, limit=3)
    division_leaders = crud.get_division_leaders(session)

    top_5_text = "\n".join([
        f"{i+1}. {p.leetcode_username} — {p.weekly_total} this week "
        f"{DIVISION_EMOJIS.get(p.division, '')} {p.division}"
        for i, p in enumerate(top_5)
    ]) if top_5 else "No data yet"

    active_text = "\n".join([
        f"• {p.leetcode_username} ({p.weekly_total} this week)"
        for p in active_today
    ]) if active_today else "No recent activity"

    division_text = "\n".join([
        f"{DIVISION_EMOJIS.get(div, '')} {div}: {p.leetcode_username} ({p.performance_score} pts)"
        for div, p in division_leaders.items()
    ])

    response = await _anthropic.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=500,
        messages=[{
            "role": "user",
            "content": f"""
Write a hype midday leaderboard update for a competitive coding WhatsApp community called CrackMode.

WEEKLY TOP 5:
{top_5_text}

GRINDING TODAY:
{active_text}

DIVISION LEADERS:
{division_text}

Rules:
- Big up people grinding today by name
- Create urgency — "the race is ON"
- Call out the gap between 1st and 2nd
- Mention division leaders
- WhatsApp formatting (*bold*, _italic_), heavy emojis
- Max 200 words
- End with "Sync your stats → crackmode.vercel.app"
"""
        }]
    )

    return f"""🏆 *CRACKMODE MIDDAY CHECK-IN* 🏆

{response.content[0].text.strip()}"""


async def generate_evening_solution(topic: dict) -> str:
    """6pm — Solution to the morning problem in Python with explanation."""
    response = await _anthropic.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1000,
        messages=[{
            "role": "user",
            "content": f"""
You are a CS tutor for a competitive coding WhatsApp community called CrackMode.

Earlier today the community was given a LeetCode problem on *{topic['topic']}*.
Now provide the solution reveal.

Structure:
1. Hype opener — "Time's up! Here's the breakdown 🔥"
2. Approach — explain the thinking in 2-3 sentences BEFORE the code
3. Python solution — clean, commented code
4. Complexity — Time: O(?), Space: O(?) with one line explanation
5. Key takeaway — the pattern to remember for {topic['topic']}

Rules:
- WhatsApp formatting (*bold*, _italic_)
- Code block using ``` backticks
- Explain like you're talking to a friend, not writing docs
- Max 350 words
- End with "React 🔥 if this clicked, ❓ if you have questions!"
"""
        }]
    )

    return f"""💡 *CRACKMODE SOLUTION DROP* 🌆
_Topic: {topic['topic']}_

{response.content[0].text.strip()}"""


async def generate_evening_streak_callout(session: Session) -> str:
    """9pm — Hype up streaks and late-night grinders."""
    streak_leaders = crud.get_streak_leaders(session, limit=3)
    active_today   = crud.get_most_active_today(session, limit=5)

    streak_text = "\n".join([
        f"• {p.leetcode_username} — {p.current_streak} days 🔥"
        for p in streak_leaders
    ]) if streak_leaders else "No streak data"

    active_text = "\n".join([
        f"• {p.leetcode_username} synced today ({p.weekly_total} this week)"
        for p in active_today
    ]) if active_today else "No activity today"

    response = await _anthropic.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=400,
        messages=[{
            "role": "user",
            "content": f"""
Write a hype night-time motivational message for a competitive coding WhatsApp community called CrackMode.

STREAK LEADERS:
{streak_text}

WHO GRINDED TODAY:
{active_text}

Rules:
- Big up the streak leaders dramatically — streaks are sacred
- Shoutout everyone who grinded today
- Motivate those who haven't solved today — "it's not too late"
- Build anticipation for tomorrow's topic
- WhatsApp formatting (*bold*, _italic_), night vibes emojis 🌙
- Max 180 words
- End with "See you at 8am sharp 💪"
"""
        }]
    )

    return f"""🌙 *CRACKMODE NIGHT ROLL CALL*

{response.content[0].text.strip()}"""


# ── WhatsApp sender ────────────────────────────────────────────────────────────

async def send_whatsapp_message(text: str):
    url = f"https://graph.facebook.com/v18.0/{settings.WHATSAPP_PHONE_ID}/messages"
    headers = {"Authorization": f"Bearer {settings.WHATSAPP_TOKEN}"}
    payload = {
        "messaging_product": "whatsapp",
        "to": settings.WHATSAPP_GROUP_ID,
        "type": "text",
        "text": {"body": text.strip()}
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        if response.status_code != 200:
            print(f"❌ WhatsApp send failed: {response.text}")
        else:
            print("✅ WhatsApp message sent")
