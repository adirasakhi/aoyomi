// Internal token-bucket rate limiter. Single choke point for all
// Shinigami traffic: budget 30 requests/minute (PRD Decision 04).

export class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private readonly capacity = 30,
    private readonly refillPerMinute = 30
  ) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  private refill(now: number) {
    const elapsedMin = (now - this.lastRefill) / 60000;
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsedMin * this.refillPerMinute
    );
    this.lastRefill = now;
  }

  // Resolves when a token is available; waits instead of bursting past budget.
  async acquire(): Promise<void> {
    for (;;) {
      const now = Date.now();
      this.refill(now);
      if (this.tokens >= 1) {
        this.tokens -= 1;
        return;
      }
      const deficit = 1 - this.tokens;
      const waitMs = Math.ceil((deficit / this.refillPerMinute) * 60000);
      await new Promise((r) => setTimeout(r, Math.min(waitMs, 60000)));
    }
  }
}

export const shinigamiBucket = new TokenBucket(30, 30);

// Request accounting for monitoring (PRD Phase 7). In-memory per instance.
const counts = new Map<string, number>();
let windowStartedAt = new Date().toISOString();

export function recordRequest(endpoint: string) {
  counts.set(endpoint, (counts.get(endpoint) ?? 0) + 1);
}

export function getRequestStats() {
  return {
    windowStartedAt,
    total: [...counts.values()].reduce((a, b) => a + b, 0),
    byEndpoint: Object.fromEntries(counts),
  };
}

export function resetRequestStats() {
  counts.clear();
  windowStartedAt = new Date().toISOString();
}
