// Adapter: raw Shinigami JSON (snake_case, numbers sometimes strings)
// -> internal camelCase model (PRD #22). All real-API shaping lives here;
// the UI and mocks only speak the internal model.

import type {
  Chapter,
  Genre,
  Manga,
  MangaDetail,
  Pagination,
  Person,
  ReaderChapter,
  SliderItem,
} from "@/types/manga";

type Raw = Record<string, unknown>;

// Real responses arrive wrapped: { status, creator, source, data: {...} }.
// Unwrap one level when `data` holds the payload object; pass through
// payloads that already sit at the top level.
export function unwrapRoot(body: unknown): Raw {
  if (body && typeof body === "object" && !Array.isArray(body)) {
    const d = (body as Raw).data;
    if (d && typeof d === "object" && !Array.isArray(d)) return d as Raw;
  }
  return ((body ?? {}) as Raw);
}

// First candidate that is an array wins; otherwise an empty list.
// Keeps pages renderable (empty state) instead of crashing on odd shapes.
export function pickList(...candidates: unknown[]): unknown[] {
  for (const c of candidates) if (Array.isArray(c)) return c;
  return [];
}

function pick(o: Raw, camel: string, snake: string): unknown {
  return o[camel] !== undefined ? o[camel] : o[snake];
}

function str(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function num(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function primitiveNum(v: unknown): number | null {
  return typeof v === "string" || typeof v === "number" ? num(v) : null;
}

function arr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function genre(g: unknown): Genre {
  if (typeof g === "string") return { id: slug(g) || g, name: g, slug: slug(g) || g };
  const o = (g ?? {}) as Raw;
  const name = typeof o.name === "string" ? o.name : "Unknown";
  const s = typeof o.slug === "string" ? o.slug : slug(name);
  return { id: typeof o.id === "string" ? o.id : s, name, slug: s };
}

function person(p: unknown, role: string): Person {
  if (typeof p === "string") return { id: slug(p) || p, name: p, role };
  const o = (p ?? {}) as Raw;
  const name = typeof o.name === "string" ? o.name : "Unknown";
  const id =
    typeof o.id === "string"
      ? o.id
      : typeof o.slug === "string"
        ? o.slug
        : slug(name);
  return {
    id,
    name,
    role: typeof o.role === "string" ? o.role : role,
  };
}

function badge(b: unknown) {
  const o = (b ?? {}) as Raw;
  return {
    name: typeof o.name === "string" ? o.name : "",
    color: typeof o.color === "string" ? o.color : "#8B949E",
  };
}

export function mapManga(m: unknown): Manga {
  const o = (m ?? {}) as Raw;
  return {
    mangaId: str(pick(o, "mangaId", "manga_id")) ?? "",
    title: str(pick(o, "title", "title")) ?? "Tanpa judul",
    alternativeTitle: str(pick(o, "alternativeTitle", "alternative_title")),
    description: str(pick(o, "description", "description")),
    cover: str(pick(o, "cover", "cover")),
    coverPortrait: str(pick(o, "coverPortrait", "cover_portrait")),
    status: str(pick(o, "status", "status")),
    releaseYear: (pick(o, "releaseYear", "release_year") ?? null) as
      | string
      | number
      | null,
    country: str(pick(o, "country", "country")),
    rating: primitiveNum(pick(o, "rating", "rating")),
    views: primitiveNum(pick(o, "views", "views")),
    bookmarks: primitiveNum(pick(o, "bookmarks", "bookmarks")),
    latestChapter: primitiveNum(pick(o, "latestChapter", "latest_chapter")),
    latestChapterId: str(pick(o, "latestChapterId", "latest_chapter_id")),
    latestChapterTime: str(pick(o, "latestChapterTime", "latest_chapter_time")),
    isRecommended: Boolean(pick(o, "isRecommended", "is_recommended") ?? false),
    genres: arr(pick(o, "genres", "genres")).map(genre),
    authors: arr(pick(o, "authors", "authors")).map((a) => person(a, "Story")),
    artists: arr(pick(o, "artists", "artists")).map((a) => person(a, "Art")),
    format: (pick(o, "format", "format") ?? null) as Manga["format"],
    type: (pick(o, "type", "type") ?? null) as Manga["type"],
  };
}

function mapChapterNav(v: unknown) {
  if (!v || typeof v !== "object") return null;
  const o = v as Raw;
  const chapterId = str(pick(o, "chapterId", "chapter_id"));
  if (!chapterId) return null;
  return {
    chapterId,
    chapterNumber: primitiveNum(pick(o, "chapterNumber", "chapter_number")) ?? 0,
  };
}

export function mapMangaDetail(m: unknown): MangaDetail {
  const o = (m ?? {}) as Raw;
  const base = mapManga(o);
  const rawLatest = pick(o, "latestChapter", "latest_chapter");
  const latestObj =
    rawLatest && typeof rawLatest === "object" ? (rawLatest as Raw) : null;
  return {
    ...base,
    rank: primitiveNum(pick(o, "rank", "rank")) ?? undefined,
    categories: arr(pick(o, "categories", "categories")).filter(
      (c): c is string => typeof c === "string"
    ),
    createdAt: str(pick(o, "createdAt", "created_at")) ?? undefined,
    updatedAt: str(pick(o, "updatedAt", "updated_at")) ?? undefined,
    latestChapterNumber:
      primitiveNum(rawLatest) ??
      (latestObj
        ? primitiveNum(pick(latestObj, "chapterNumber", "chapter_number"))
        : null),
    latestChapter: latestObj
      ? {
          chapterId:
            str(pick(latestObj, "chapterId", "chapter_id")) ??
            base.latestChapterId ??
            "",
          chapterNumber:
            primitiveNum(pick(latestObj, "chapterNumber", "chapter_number")) ??
            base.latestChapter ??
            0,
          updatedAt:
            str(pick(latestObj, "updatedAt", "updated_at")) ?? "",
        }
      : undefined,
  };
}

export function mapSliderItem(s: unknown): SliderItem {
  const o = (s ?? {}) as Raw;
  return {
    id: str(pick(o, "id", "id")) ?? "",
    title: str(pick(o, "title", "title")) ?? "Tanpa judul",
    rating: primitiveNum(pick(o, "rating", "rating")) ?? 0,
    backgroundImage: str(pick(o, "backgroundImage", "background_image")) ?? "",
    charaImage: str(pick(o, "charaImage", "chara_image")) ?? "",
    mangaId: str(pick(o, "mangaId", "manga_id")) ?? "",
    blurColor: str(pick(o, "blurColor", "blur_color")) ?? "#161B22",
    category: str(pick(o, "category", "category")) ?? "",
    description: str(pick(o, "description", "description")) ?? "",
    badges: arr(pick(o, "badges", "badges")).map(badge),
  };
}

export function mapPagination(p: unknown): Pagination {
  const o = (p ?? {}) as Raw;
  return {
    currentPage: primitiveNum(pick(o, "currentPage", "current_page")) ?? 1,
    totalPages: primitiveNum(pick(o, "totalPages", "total_pages")) ?? 1,
    totalRecord: primitiveNum(pick(o, "totalRecord", "total_record")) ?? 0,
    pageSize: primitiveNum(pick(o, "pageSize", "page_size")) ?? 20,
  };
}

export function mapChapter(c: unknown): Chapter {
  const o = (c ?? {}) as Raw;
  return {
    chapterId: str(pick(o, "chapterId", "chapter_id")) ?? "",
    mangaId: str(pick(o, "mangaId", "manga_id")) ?? "",
    chapterNumber: primitiveNum(pick(o, "chapterNumber", "chapter_number")) ?? 0,
    chapterTitle: str(pick(o, "chapterTitle", "chapter_title")),
    thumbnail: str(pick(o, "thumbnail", "thumbnail")),
    views: primitiveNum(pick(o, "views", "views")),
    releaseDate: str(pick(o, "releaseDate", "release_date")),
  };
}

export function mapReaderChapter(r: unknown): ReaderChapter {
  const o = (r ?? {}) as Raw;
  const images = arr(pick(o, "images", "images")).filter(
    (u): u is string => typeof u === "string"
  );
  return {
    chapterId: str(pick(o, "chapterId", "chapter_id")) ?? "",
    mangaId: str(pick(o, "mangaId", "manga_id")) ?? "",
    mangaTitle: str(pick(o, "mangaTitle", "manga_title") ?? pick(o, "title", "comic_title")),
    chapterNumber: primitiveNum(pick(o, "chapterNumber", "chapter_number")) ?? 0,
    chapterTitle: str(pick(o, "chapterTitle", "chapter_title")),
    thumbnail: str(pick(o, "thumbnail", "thumbnail")),
    views: primitiveNum(pick(o, "views", "views")),
    releaseDate: str(pick(o, "releaseDate", "release_date")),
    prevChapter: mapChapterNav(pick(o, "prevChapter", "prev_chapter")),
    nextChapter: mapChapterNav(pick(o, "nextChapter", "next_chapter")),
    images,
    totalImages: primitiveNum(pick(o, "totalImages", "total_images")) ?? images.length,
  };
}
