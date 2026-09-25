import { describe, it, expect } from "vitest";
import {
  mapManga,
  mapMangaDetail,
  mapSliderItem,
  mapPagination,
  mapChapter,
  mapReaderChapter,
  pickList,
  unwrapRoot,
} from "./map";

// Fixtures mirror the raw snake_case API shape from PRD_Web_Baca_Komik.md.
describe("map", () => {
  it("maps manga list items and coerces string numbers", () => {
    const m = mapManga({
      manga_id: "abc",
      title: "Sword",
      alternative_title: null,
      description: "d",
      cover: "c",
      cover_portrait: "cp",
      status: "Ongoing",
      release_year: 2022,
      country: "Korea",
      rating: "4.6",
      views: "120400",
      bookmarks: "8400",
      latest_chapter: "192",
      latest_chapter_id: "ch-1",
      latest_chapter_time: "2026-09-20T10:00:00Z",
      is_recommended: true,
      genres: ["Action", { id: "g-m", name: "Mystery", slug: "mystery" }],
      authors: ["Han J."],
      artists: [{ name: "Kim T." }],
      format: "Manhwa",
      type: "Action",
    });
    expect(m.mangaId).toBe("abc");
    expect(m.coverPortrait).toBe("cp");
    expect(m.rating).toBe(4.6);
    expect(m.views).toBe(120400);
    expect(m.latestChapter).toBe(192);
    expect(m.isRecommended).toBe(true);
    expect(m.genres).toEqual([
      { id: "action", name: "Action", slug: "action" },
      { id: "g-m", name: "Mystery", slug: "mystery" },
    ]);
    expect(m.authors).toEqual([{ id: "han-j", name: "Han J.", role: "Story" }]);
    expect(m.artists[0].name).toBe("Kim T.");
  });

  it("accepts already-camel payloads untouched", () => {
    const m = mapManga({ mangaId: "x", title: "T", rating: 4.5, genres: [], authors: [], artists: [] });
    expect(m.mangaId).toBe("x");
    expect(m.rating).toBe(4.5);
  });

  it("maps detail with object latest_chapter", () => {
    const d = mapMangaDetail({
      manga_id: "abc",
      title: "Sword",
      genres: [],
      authors: [],
      artists: [],
      latest_chapter: {
        chapter_id: "ch-192",
        chapter_number: "192",
        updated_at: "2026-09-20T10:00:00Z",
      },
    });
    expect(d.latestChapterNumber).toBe(192);
    expect(d.latestChapter).toEqual({
      chapterId: "ch-192",
      chapterNumber: 192,
      updatedAt: "2026-09-20T10:00:00Z",
    });
  });

  it("maps slider items", () => {
    const s = mapSliderItem({
      id: "s1",
      title: "Night",
      rating: "4.8",
      background_image: "bg",
      chara_image: "ch",
      manga_id: "m1",
      blur_color: "#000",
      category: "explore-1",
      description: "d",
      badges: [{ name: "New", color: "#58A6FF" }],
    });
    expect(s.backgroundImage).toBe("bg");
    expect(s.charaImage).toBe("ch");
    expect(s.mangaId).toBe("m1");
    expect(s.rating).toBe(4.8);
  });

  it("unwraps the {status,creator,source,data} envelope", () => {
    const body = {
      status: "success",
      creator: "Sanka Vollerei",
      source: "Shinigami",
      data: { latest: [{ manga_id: "a", title: "A" }], recommended: [], popular: [] },
      latest: [],
      recommended: [],
      popular: [],
    };
    const root = unwrapRoot(body);
    expect(pickList(root.latest).map(mapManga)[0]?.mangaId).toBe("a");
  });

  it("passes through already-unwrapped payloads", () => {
    const root = unwrapRoot({ latest: [{ manga_id: "b", title: "B" }] });
    expect(pickList(root.latest).map(mapManga)[0]?.mangaId).toBe("b");
    expect(pickList((unwrapRoot({}) as Record<string, unknown>).missing)).toEqual([]);
  });

  it("maps pagination, chapters, and reader", () => {
    expect(
      mapPagination({ current_page: "2", total_pages: 10, total_record: "200", page_size: 20 })
    ).toEqual({ currentPage: 2, totalPages: 10, totalRecord: 200, pageSize: 20 });
    const c = mapChapter({ chapter_id: "c1", manga_id: "m1", chapter_number: "5" });
    expect(c).toMatchObject({ chapterId: "c1", chapterNumber: 5 });
    const r = mapReaderChapter({
      chapter_id: "c1",
      manga_id: "m1",
      manga_title: "Absolute Sword Sense",
      chapter_number: "5",
      images: ["a", "b"],
      total_images: "2",
      prev_chapter: { chapter_id: "c0", chapter_number: "4" },
      next_chapter: null,
    });
    expect(r.totalImages).toBe(2);
    expect(r.mangaTitle).toBe("Absolute Sword Sense");
    expect(r.prevChapter).toEqual({ chapterId: "c0", chapterNumber: 4 });
    expect(r.nextChapter).toBeNull();
  });
});
