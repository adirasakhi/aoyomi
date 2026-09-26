import type { DetailResponse } from "@/types/manga";
import { mockMangas } from "./mangas";

function delay<T>(value: T, ms = 180): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function mockDetail(mangaId: string): Promise<DetailResponse> {
  const found = mockMangas.find((m) => m.mangaId === mangaId);
  if (!found) {
    await delay(null);
    throw new Error("Manga tidak ditemukan.");
  }
  const { latestChapter, ...rest } = found;
  return delay({
    data: {
      ...rest,
      rank: 12,
      categories: ["Ongoing"],
      createdAt: "2022-01-10T00:00:00Z",
      updatedAt: found.latestChapterTime ?? undefined,
      latestChapterNumber: latestChapter ?? null,
      firstChapter: {
        chapterId: `ch-${mangaId}-1`,
        chapterNumber: 1,
        updatedAt: "2022-01-10T00:00:00Z",
      },
      latestChapter: found.latestChapterId
        ? {
            chapterId: found.latestChapterId,
            chapterNumber: latestChapter ?? 1,
            updatedAt: found.latestChapterTime ?? "",
          }
        : undefined,
    },
  });
}
