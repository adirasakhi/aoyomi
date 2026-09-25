import { describe, it, expect } from "vitest";
import { MockMangaRepository } from "@/lib/api/mock-repository";

const repo = new MockMangaRepository();

describe("MockMangaRepository", () => {
  it("returns home sections", async () => {
    const home = await repo.getHome();
    expect(home.latest.length).toBeGreaterThan(0);
    expect(home.popular.length).toBeGreaterThan(0);
  });

  it("searches case-insensitively", async () => {
    const res = await repo.search("sword");
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data[0].title.toLowerCase()).toContain("sword");
  });

  it("returns empty search for unknown title", async () => {
    const res = await repo.search("judul-yang-tidak-ada-xyz");
    expect(res.data.length).toBe(0);
    expect(res.pagination.totalRecord).toBe(0);
  });

  it("throws for unknown manga", async () => {
    await expect(repo.getDetail("unknown")).rejects.toThrow();
  });

  it("paginates chapters newest-first", async () => {
    const p1 = await repo.getChapters("manga-absolute-sword-sense", 1);
    expect(p1.data[0].chapterNumber).toBe(192);
    expect(p1.pagination.totalPages).toBeGreaterThan(1);
  });

  it("returns reader with prev/next navigation", async () => {
    const r = await repo.getChapter("ch-manga-absolute-sword-sense-192");
    expect(r.data.images.length).toBe(r.data.totalImages);
    expect(r.data.prevChapter?.chapterNumber).toBe(191);
    expect(r.data.nextChapter?.chapterNumber).toBe(193);
  });
});
