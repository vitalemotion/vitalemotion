import { describe, it, expect, vi, beforeEach } from "vitest";

// The rate-limit module uses a module-level Map, so we need to
// re-import it fresh for each test to avoid state leaking.
// We use vi.resetModules() + dynamic import for isolation.

async function freshRateLimit() {
  vi.resetModules();
  const mod = await import("@/lib/rate-limit");
  return mod.rateLimit;
}

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("allows requests under the limit", async () => {
    const rateLimit = await freshRateLimit();

    const result1 = rateLimit("user-1", { maxRequests: 3, windowMs: 60_000 });
    expect(result1.success).toBe(true);
    expect(result1.remaining).toBe(2);

    const result2 = rateLimit("user-1", { maxRequests: 3, windowMs: 60_000 });
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(1);

    const result3 = rateLimit("user-1", { maxRequests: 3, windowMs: 60_000 });
    expect(result3.success).toBe(true);
    expect(result3.remaining).toBe(0);
  });

  it("blocks requests over the limit", async () => {
    const rateLimit = await freshRateLimit();

    // Exhaust the limit
    for (let i = 0; i < 3; i++) {
      rateLimit("user-blocked", { maxRequests: 3, windowMs: 60_000 });
    }

    // Next request should be blocked
    const result = rateLimit("user-blocked", {
      maxRequests: 3,
      windowMs: 60_000,
    });
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("different identifiers are independent", async () => {
    const rateLimit = await freshRateLimit();

    // Exhaust limit for user-a
    for (let i = 0; i < 2; i++) {
      rateLimit("user-a", { maxRequests: 2, windowMs: 60_000 });
    }

    // user-a is blocked
    const resultA = rateLimit("user-a", { maxRequests: 2, windowMs: 60_000 });
    expect(resultA.success).toBe(false);

    // user-b should still be allowed
    const resultB = rateLimit("user-b", { maxRequests: 2, windowMs: 60_000 });
    expect(resultB.success).toBe(true);
    expect(resultB.remaining).toBe(1);
  });

  it("resets after window expires", async () => {
    vi.useFakeTimers();
    const rateLimit = await freshRateLimit();

    // Exhaust the limit
    for (let i = 0; i < 2; i++) {
      rateLimit("user-reset", { maxRequests: 2, windowMs: 10_000 });
    }

    // Should be blocked
    const blocked = rateLimit("user-reset", {
      maxRequests: 2,
      windowMs: 10_000,
    });
    expect(blocked.success).toBe(false);

    // Advance time past the window
    vi.advanceTimersByTime(11_000);

    // Should be allowed again
    const allowed = rateLimit("user-reset", {
      maxRequests: 2,
      windowMs: 10_000,
    });
    expect(allowed.success).toBe(true);
    expect(allowed.remaining).toBe(1);
  });
});
