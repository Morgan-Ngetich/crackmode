"""
Sliding-window rate limiter for the upstream LeetCode API.

The alfa-leetcode-api enforces 120 requests / IP / hour.
We cap ourselves at 90 to leave a 30-request buffer for bursts
(manual syncs, setup calls) that share the same IP.

This is a module-level singleton — import `leetcode_rate_limiter`
everywhere instead of creating new instances. All code paths
(daily sync, manual /sync, /setup) draw from the same pool.
"""

import asyncio
import time
from collections import deque


class SlidingWindowRateLimiter:
    """
    Async sliding-window rate limiter.

    Tracks the timestamps of recent API calls and blocks until a slot
    opens up when the limit is reached.  Thread-safe for asyncio; not
    safe across multiple OS processes (not needed — one Railway dyno).
    """

    def __init__(self, max_calls: int, window_seconds: float):
        self._max_calls = max_calls
        self._window = window_seconds
        self._timestamps: deque[float] = deque()
        self._lock = asyncio.Lock()

    async def acquire(self) -> None:
        """
        Block until a call slot is available, then claim it.
        Called once per outbound HTTP request to the LeetCode API.
        """
        async with self._lock:
            now = time.monotonic()

            # Evict timestamps outside the current window
            while self._timestamps and now - self._timestamps[0] >= self._window:
                self._timestamps.popleft()

            if len(self._timestamps) >= self._max_calls:
                # Sleep until the oldest recorded call falls outside the window
                oldest = self._timestamps[0]
                wait = self._window - (now - oldest) + 0.1   # 0.1s safety margin
                await asyncio.sleep(wait)

                # Re-evict after sleeping
                now = time.monotonic()
                while self._timestamps and now - self._timestamps[0] >= self._window:
                    self._timestamps.popleft()

            self._timestamps.append(time.monotonic())

    @property
    def calls_in_window(self) -> int:
        """How many calls have been made in the current window (for diagnostics)."""
        now = time.monotonic()
        return sum(1 for t in self._timestamps if now - t < self._window)


# ── Global singleton ───────────────────────────────────────────────────────────
# 90 calls/hour leaves a 30-call buffer from the upstream 120/hour hard limit.
# Import this object — don't instantiate a new one.
leetcode_rate_limiter = SlidingWindowRateLimiter(
    max_calls=90,
    window_seconds=3600.0,
)
