import { describe, it, expect } from "vitest";
import { TokenBucket, recordRequest, getRequestStats, resetRequestStats } from "./rate-limiter";
import { HttpError, cleanId, cleanQuery, cleanPage, assertObjectBody } from "./validate";

describe("TokenBucket", () => {
  it("allows bursts up to capacity without waiting", async () => {
    const bucket = new TokenBucket(3, 60);
    const start = Date.now();
    await bucket.acquire();
    await bucket.acquire();
    await bucket.acquire();
    expect(Date.now() - start).toBeLessThan(200);
  });

  it("throttles past capacity instead of bursting", async () => {
    // 2 tokens, 2/min refill => third acquire waits ~30s is too slow;
    // use 120/min (1 token per 500ms) so the test takes ~0.5s.
    const bucket = new TokenBucket(2, 120);
    await bucket.acquire();
    await bucket.acquire();
    const start = Date.now();
    await bucket.acquire();
    expect(Date.now() - start).toBeGreaterThanOrEqual(350);
  });
});

describe("request stats", () => {
  it("counts per endpoint", () => {
    resetRequestStats();
    recordRequest("home");
    recordRequest("home");
    recordRequest("read");
    const stats = getRequestStats();
    expect(stats.total).toBe(3);
    expect(stats.byEndpoint).toEqual({ home: 2, read: 1 });
  });
});

describe("validate", () => {
  it("accepts well-formed ids", () => {
    expect(cleanId("f0a8f3d7-d509-4ea7-b55f-b0a8127fdb99", "Manga ID")).toBe(
      "f0a8f3d7-d509-4ea7-b55f-b0a8127fdb99"
    );
  });

  it("rejects empty, long, or path-traversal ids", () => {
    for (const bad of ["", "../secret", "/home", "a".repeat(200), "with space"]) {
      expect(() => cleanId(bad, "ID")).toThrow(HttpError);
    }
  });

  it("rejects empty or oversized queries", () => {
    expect(() => cleanQuery("  ")).toThrow(HttpError);
    expect(() => cleanQuery("a".repeat(101))).toThrow(HttpError);
    expect(cleanQuery(" solo leveling ")).toBe("solo leveling");
  });

  it("accepts sane pages only", () => {
    expect(cleanPage("3")).toBe(3);
    expect(cleanPage(null)).toBe(1);
    for (const bad of ["0", "-2", "1.5", "abc", "501"]) {
      expect(() => cleanPage(bad)).toThrow(HttpError);
    }
  });

  it("rejects empty bodies from the real API", () => {
    for (const bad of [null, undefined, 0, "null", 42]) {
      expect(() => assertObjectBody(bad)).toThrow(HttpError);
    }
    expect(() => assertObjectBody({ data: [] })).not.toThrow();
  });
});
