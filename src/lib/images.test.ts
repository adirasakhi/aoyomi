import { describe, it, expect } from "vitest";
import { proxied } from "./images";

describe("proxied", () => {
  it("routes comic CDN hosts through the image proxy", () => {
    expect(proxied("https://assets.shngm.id/thumbnail/cover/a.jpg")).toBe(
      "/api/image?url=https%3A%2F%2Fassets.shngm.id%2Fthumbnail%2Fcover%2Fa.jpg"
    );
    expect(proxied("https://storage.shngm.id/thumbnail/image/b.jpg")).toContain("/api/image?url=");
  });

  it("leaves local paths, data URIs, and mock images direct", () => {
    expect(proxied("/logo.png")).toBe("/logo.png");
    expect(proxied("https://picsum.photos/seed/a/400/560")).toBe(
      "https://picsum.photos/seed/a/400/560"
    );
    expect(proxied(null)).toBeNull();
    expect(proxied("")).toBeNull();
  });
});
