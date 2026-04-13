from datetime import datetime, date, timezone

# ── Set this to the day you launch the competition ────────────────────────────
COMPETITION_START_DATE = date(2026, 4, 14)  # ← Day 1

# Alternates: DSA/Algo day → System Design day → repeat
DAILY_TOPICS = [
    {"day": 1,  "topic": "Stacks",              "category": "Data Structures"},
    {"day": 2,  "topic": "Load Balancers",       "category": "System Design"},
    {"day": 3,  "topic": "Queues",               "category": "Data Structures"},
    {"day": 4,  "topic": "Caching",              "category": "System Design"},
    {"day": 5,  "topic": "Linked Lists",         "category": "Data Structures"},
    {"day": 6,  "topic": "CDNs",                 "category": "System Design"},
    {"day": 7,  "topic": "Hash Maps",            "category": "Data Structures"},
    {"day": 8,  "topic": "Message Queues",       "category": "System Design"},
    {"day": 9,  "topic": "Binary Trees",         "category": "Data Structures"},
    {"day": 10, "topic": "Database Sharding",    "category": "System Design"},
    {"day": 11, "topic": "Binary Search",        "category": "Algorithms"},
    {"day": 12, "topic": "Rate Limiting",        "category": "System Design"},
    {"day": 13, "topic": "Sliding Window",       "category": "Algorithms"},
    {"day": 14, "topic": "API Gateways",         "category": "System Design"},
    {"day": 15, "topic": "Two Pointers",         "category": "Algorithms"},
    {"day": 16, "topic": "Consistent Hashing",   "category": "System Design"},
    {"day": 17, "topic": "Heaps",                "category": "Data Structures"},
    {"day": 18, "topic": "SQL vs NoSQL",         "category": "System Design"},
    {"day": 19, "topic": "Graphs",               "category": "Data Structures"},
    {"day": 20, "topic": "Microservices",        "category": "System Design"},
    {"day": 21, "topic": "Recursion",            "category": "Algorithms"},
    {"day": 22, "topic": "Event-Driven Design",  "category": "System Design"},
    {"day": 23, "topic": "Dynamic Programming",  "category": "Algorithms"},
    {"day": 24, "topic": "CAP Theorem",          "category": "System Design"},
    {"day": 25, "topic": "Backtracking",         "category": "Algorithms"},
    {"day": 26, "topic": "Kafka",                "category": "System Design"},
    {"day": 27, "topic": "Greedy Algorithms",    "category": "Algorithms"},
    {"day": 28, "topic": "WebSockets",           "category": "System Design"},
]

CATEGORY_EMOJIS = {
    "Data Structures": "🗂️",
    "Algorithms":      "⚙️",
    "System Design":   "🏗️",
}


def get_current_index() -> int:
    """
    Get today's index based on days elapsed since COMPETITION_START_DATE.
    Day 1 = index 0 = Stacks. Cycles through all topics after 28 days.
    """
    today = datetime.now(timezone.utc).date()
    days_elapsed = (today - COMPETITION_START_DATE).days
    # Clamp to 0 if called before competition starts
    days_elapsed = max(0, days_elapsed)
    return days_elapsed % len(DAILY_TOPICS)


def get_daily_topic() -> dict:
    """Get today's topic with its index attached."""
    index = get_current_index()
    topic = DAILY_TOPICS[index].copy()
    topic["index"] = index
    topic["day_number"] = index + 1
    return topic


def get_topics_covered_so_far() -> list[dict]:
    """Return all topics covered UP TO AND INCLUDING today."""
    index = get_current_index()
    return DAILY_TOPICS[:index + 1]


def get_topics_covered_summary() -> str:
    """
    WhatsApp-ready summary of all topics covered so far, grouped by category.
    Injected into morning messages.
    """
    covered = get_topics_covered_so_far()

    if len(covered) <= 1:
        return ""  # Nothing to recap on Day 1

    grouped: dict[str, list[str]] = {}
    for t in covered[:-1]:  # exclude today — it's the new topic
        cat = t["category"]
        grouped.setdefault(cat, []).append(t["topic"])

    lines = ["📖 *Topics covered so far:*"]
    for category, topics in grouped.items():
        emoji = CATEGORY_EMOJIS.get(category, "📌")
        topic_list = ", ".join(topics)
        lines.append(f"{emoji} _{category}_: {topic_list}")

    return "\n".join(lines)