import type { ChaptersResponse } from "@/types/manga";
import { mockMangas } from "./mangas";

const PAGE_SIZE = 20;

function delay<T>(value: T, ms = 180): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function mockChapters(mangaId: string, page = 1): Promise<ChaptersResponse> {
  const manga = mockMangas.find((m) => m.mangaId === mangaId);
  if (!manga) throw new Error("Manga tidak ditemukan.");

  const total = manga.latestChapter ?? 12;
  const all = Array.from({ length: total }, (_, i) => {
    const n = total - i;
    return {
      chapterId: `ch-${mangaId}-${n}`,
      mangaId,
      chapterNumber: n,
      chapterTitle: n === total ? "Current arc climax" : null,
      thumbnail: `https://picsum.photos/seed/${mangaId}-${n}/320/180`,
      views: 1000 + n * 37,
      releaseDate: "2026-09-01",
    };
  });

  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;

  return delay({
    mangaId,
    pagination: {
      currentPage,
      totalPages,
      totalRecord: all.length,
      pageSize: PAGE_SIZE,
    },
    data: all.slice(start, start + PAGE_SIZE),
  });
}
