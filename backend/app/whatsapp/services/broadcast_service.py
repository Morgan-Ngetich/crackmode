"""
Teaching agent for CrackMode WhatsApp broadcasts.

DSA days:
  Morning  → Teach concept + Python coding problem (builds on previous DSA topics)
  Evening  → Solution reveal + explanation

System Design days:
  Morning  → Deep teach the concept + real-world examples (builds on previous SD topics)
  Evening  → Summary + conclusion + real-world case study recap

All messages are progressive — Gemini is always given the previous topics
as context so it can build on them naturally.
"""

import httpx
from google import genai
from google.genai import types
from sqlmodel import Session
from app.core.config import settings
from app import crud
from app.whatsapp.contents.topics import (
    get_daily_topic,
    get_topics_covered_summary,
    DAILY_TOPICS,
    CATEGORY_EMOJIS,
)

# ── Gemini setup ───────────────────────────────────────────────────────────────
_gemini = genai.Client(api_key=settings.GEMINI_API_KEY)
GEMINI_MODEL = "gemini-2.5-flash"

DIVISION_EMOJIS = {
    "Diamond": "💎",
    "Platinum": "🪙",
    "Gold": "🥇",
    "Silver": "🥈",
    "Bronze": "🥉",
}


# ── Core Gemini helper ─────────────────────────────────────────────────────────


async def _ask_gemini(prompt: str, max_tokens: int = 1024) -> str:
    response = await _gemini.aio.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            max_output_tokens=max_tokens,
            thinking_config=types.ThinkingConfig(thinking_budget=0),
        ),
    )
    return response.text.strip()


# ── Context builder ────────────────────────────────────────────────────────────


def _build_progression_context(topic: dict) -> str:
    """
    Returns a context string of all previously covered topics IN THE SAME CATEGORY
    so Gemini can build on them progressively.
    """
    current_index = topic["index"]
    current_category = topic["category"]

    previous_in_category = [
        t["topic"]
        for t in DAILY_TOPICS[:current_index]
        if t["category"] == current_category
    ]

    if not previous_in_category:
        return f"This is the FIRST {current_category} topic in the curriculum."

    topics_str = ", ".join(previous_in_category)
    return (
        f"Previous {current_category} topics already covered: {topics_str}. "
        f"Build on these naturally where relevant — the community already knows them."
    )


# ── DSA Morning: Teach + coding problem ───────────────────────────────────────


async def _generate_dsa_morning(topic: dict) -> str:
    progression = _build_progression_context(topic)
    recap = get_topics_covered_summary()

    lesson = await _ask_gemini(
        f"""
You are a hype CS tutor for a competitive coding WhatsApp community called CrackMode.
Today is Day {topic["day_number"]} of the curriculum.

PROGRESSION CONTEXT:
{progression}

Your job: Teach *{topic["topic"]}* (Data Structures & Algorithms) in a way that builds
on what the community already knows.

Structure your message EXACTLY like this:

1. *Hook* — one punchy, energetic opening line
2. *What is {topic["topic"]}?* — clear explanation, 3-4 sentences. If relevant, contrast or connect it to a previously covered topic.
3. *How it works* — walk through the core mechanism with a short analogy.
4. *Python illustration* — a short code snippet (10-15 lines) that demonstrates the concept itself, NOT a LeetCode solution. Show it being built or used. Use ``` for code blocks.
5. *Time & Space complexity* — one line each.
6. *🎯 Challenge of the Day* — ONE real LeetCode problem that directly tests {topic["topic"]}.
   Format: 🟢/🟡/🔴 *Problem Name* (LeetCode #XXX)
   Then: one line hint — the key insight without giving away the solution.

Rules:
- WhatsApp formatting ONLY (*bold*, _italic_, ``` for code)
- Energetic, community feel — like a coach, not a textbook
- Max 450 words
- Do NOT number the sections or show section headers — flow naturally from one part to the next
- Write as a continuous message, not a structured document
- End with: "Drop your solution at 6pm! 👇"
""",
        max_tokens=2048,
    )

    parts = [
        f"⚙️ *GOOD MORNING CRACKMODE* ☀️",
        f"_Day {topic['day_number']}: {topic['topic']} — {topic['category']}_",
        "",
        lesson,
    ]
    if recap:
        parts += ["", "─" * 20, "", recap]

    return "\n".join(parts)


# ── DSA Evening: Solution reveal ──────────────────────────────────────────────


async def _generate_dsa_evening(topic: dict) -> str:
    progression = _build_progression_context(topic)

    solution = await _ask_gemini(
        f"""
You are a CS tutor for a competitive coding WhatsApp community called CrackMode.

Earlier today the community was given a LeetCode problem on *{topic["topic"]}*.

PROGRESSION CONTEXT:
{progression}

Now provide the solution reveal. Build on the community's existing knowledge where useful.

Structure EXACTLY:
1. *Time's up! Here's the breakdown* 🔥 — one hype opener line
2. *The approach* — explain the thinking in 2-3 sentences BEFORE showing code. Why does {topic["topic"]} solve this efficiently?
3. *Python solution* — clean, well-commented code in ``` block
4. *Complexity* — Time: O(?) | Space: O(?) — one line each with brief reason
5. *The pattern to remember* — one sentence: when should you reach for {topic["topic"]}?
6. *Connection* — if applicable, briefly connect to a previously covered topic ({progression})

Rules:
- WhatsApp formatting (*bold*, _italic_, ``` for code)
- Explain like talking to a smart friend, not writing docs
- Max 350 words
- End with: "React 🔥 if this clicked, ❓ if you have questions!"
""",
        max_tokens=1200,
    )

    return f"💡 *CRACKMODE SOLUTION DROP* 🌆\n_Day {topic['day_number']}: {topic['topic']}_\n\n{solution}"


# ── System Design Morning: Deep teach ─────────────────────────────────────────


async def _generate_system_design_morning(topic: dict) -> str:
    progression = _build_progression_context(topic)
    recap = get_topics_covered_summary()

    lesson = await _ask_gemini(
        f"""
You are a system design educator for a competitive coding WhatsApp community called CrackMode.
Today is Day {topic["day_number"]} of the curriculum.

PROGRESSION CONTEXT:
{progression}

Your job: Teach *{topic["topic"]}* (System Design) in depth, building on what the community already knows.

Structure EXACTLY:

1. *Hook* — one punchy opening line that makes this concept feel important
2. *What is {topic["topic"]}?* — clear definition, 3-4 sentences. Connect to previously covered concepts if relevant.
3. *The problem it solves* — what breaks without it? Paint a vivid picture.
4. *How it works* — walk through the mechanism step by step. Use → arrows for flow diagrams where helpful.
5. *Python illustration* — a short code snippet (10-15 lines) that illustrates the concept in code. For example: caching → lru_cache, rate limiting → sliding window counter, load balancing → round robin. Use ``` for code blocks.
6. *Real-world examples* — name 2 actual companies and HOW they use this (e.g. "Netflix uses X to Y")
7. *Key trade-offs* — what does this approach sacrifice?
8. *🎯 Challenge of the Day* — a design thinking question. NOT a LeetCode problem.
   Format: "If you were building [real system], how would you use {topic["topic"]} to handle [specific problem]? Think about it — answer at 9pm 👇"

Rules:
- WhatsApp formatting (*bold*, _italic_, ``` for code)
- Energetic but educational — like a senior engineer mentoring juniors
- Max 500 words
- End with: "Evening wrap-up drops at 9pm 🌙"
""",
        max_tokens=1500,
    )

    parts = [
        f"🏗️ *GOOD MORNING CRACKMODE* ☀️",
        f"_Day {topic['day_number']}: {topic['topic']} — {topic['category']}_",
        "",
        lesson,
    ]
    if recap:
        parts += ["", "─" * 20, "", recap]

    return "\n".join(parts)


# ── System Design Evening: Summary + case study ───────────────────────────────


async def _generate_system_design_evening(topic: dict) -> str:
    progression = _build_progression_context(topic)

    summary = await _ask_gemini(
        f"""
You are a system design educator for a competitive coding WhatsApp community called CrackMode.

This morning the community learned about *{topic["topic"]}* and were given a design challenge.

PROGRESSION CONTEXT:
{progression}

Now deliver the evening wrap-up. This should feel like the end of a great lecture —
satisfying, memorable, and leaving them excited for tomorrow.

Structure EXACTLY:
1. *Wrap-up* — one line: "Today we covered X. Here's what to lock in:"
2. *The 3 things to remember* — bullet points, one line each. The absolute essentials.
3. *Challenge answer* — address the morning's design challenge. Give a solid 3-4 sentence answer with a short Python snippet if it helps illustrate. Use ``` for code.
4. *Real-world case study* — pick ONE famous system (Netflix, Uber, WhatsApp, Discord, etc.) and explain in 3-4 sentences HOW they specifically use {topic["topic"]} in production.
5. *How it connects* — one sentence connecting today's topic to a previously covered concept ({progression})
6. *Tomorrow teaser* — build anticipation without revealing the topic

Rules:
- WhatsApp formatting (*bold*, _italic_, ``` for code)
- Concise — this is a wrap-up, not a re-teach
- Max 300 words
- End with: "See you at 8am sharp 💪"
""",
        max_tokens=1000,
    )

    return f"🌙 *CRACKMODE EVENING WRAP-UP*\n_Day {topic['day_number']}: {topic['topic']} — Summary_\n\n{summary}"


# ── Public dispatch functions ──────────────────────────────────────────────────


async def generate_morning_lesson_and_problem(topic: dict) -> str:
    """Routes to DSA or System Design morning generator based on category."""
    if topic["category"] == "System Design":
        return await _generate_system_design_morning(topic)
    else:
        return await _generate_dsa_morning(topic)


async def generate_evening_solution(topic: dict) -> str:
    """Routes to DSA solution reveal or System Design evening summary."""
    if topic["category"] == "System Design":
        return await _generate_system_design_evening(topic)
    else:
        return await _generate_dsa_evening(topic)


# ── Midday leaderboard (unchanged) ────────────────────────────────────────────


async def generate_midday_leaderboard(session: Session) -> str:
    top_5 = crud.get_top_solvers_this_week(session, limit=5)
    active_today = crud.get_most_active_today(session, limit=3)
    division_leaders = crud.get_division_leaders(session)

    top_5_text = (
        "\n".join(
            [
                f"{i + 1}. {p.leetcode_username} — {p.weekly_total} this week "
                f"{DIVISION_EMOJIS.get(p.division, '')} {p.division}"
                for i, p in enumerate(top_5)
            ]
        )
        if top_5
        else "No data yet"
    )

    active_text = (
        "\n".join(
            [
                f"• {p.leetcode_username} ({p.weekly_total} this week)"
                for p in active_today
            ]
        )
        if active_today
        else "No recent activity"
    )

    division_text = (
        "\n".join(
            [
                f"{DIVISION_EMOJIS.get(div, '')} {div}: {p.leetcode_username} ({p.performance_score} pts)"
                for div, p in division_leaders.items()
            ]
        )
        if division_leaders
        else "No division data"
    )

    message = await _ask_gemini(f"""
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
- Call out the gap between 1st and 2nd if there is one
- Mention division leaders
- WhatsApp formatting (*bold*, _italic_), heavy emojis
- Max 200 words
- End with "Sync your stats → https://crackmode.vercel.app"
""")

    return f"🏆 *CRACKMODE MIDDAY CHECK-IN* 🏆\n\n{message}"


# ── Night streak callout (unchanged) ──────────────────────────────────────────


async def generate_evening_streak_callout(session: Session) -> str:
    streak_leaders = crud.get_streak_leaders(session, limit=3)
    active_today = crud.get_most_active_today(session, limit=5)

    streak_text = (
        "\n".join(
            [
                f"• {p.leetcode_username} — {p.current_streak} days 🔥"
                for p in streak_leaders
            ]
        )
        if streak_leaders
        else "No streak data"
    )

    active_text = (
        "\n".join(
            [
                f"• {p.leetcode_username} synced today ({p.weekly_total} this week)"
                for p in active_today
            ]
        )
        if active_today
        else "No activity today"
    )

    message = await _ask_gemini(f"""
Write a hype night-time motivational message for a competitive coding WhatsApp community called CrackMode.

STREAK LEADERS:
{streak_text}

WHO GRINDED TODAY:
{active_text}

Rules:
- Big up the streak leaders dramatically — streaks are sacred
- Shoutout everyone who grinded today by name
- Motivate those who haven't solved today — "it's not too late"
- Build anticipation for tomorrow
- WhatsApp formatting (*bold*, _italic_), night vibes emojis 🌙
- Max 180 words
- End with: "See you at 8am sharp 💪"
""")

    return f"🌙 *CRACKMODE NIGHT ROLL CALL*\n\n{message}"


# ── WhatsApp sender (Green API) ────────────────────────────────────────────────


async def send_whatsapp_message(text: str):
    url = (
        f"{settings.GREEN_API_URL}"
        f"/waInstance{settings.GREEN_API_INSTANCE_ID}"
        f"/sendMessage/{settings.GREEN_API_TOKEN}"
    )
    payload = {
        "chatId": settings.GREEN_API_GROUP_ID,
        "message": text.strip(),
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload)
        if response.status_code != 200:
            print(f"❌ WhatsApp send failed: {response.text}")
        else:
            print("✅ WhatsApp message sent")
