import type { ReaderResponse } from "@/types/manga";
import { mockMangas } from "./mangas";

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// chapterId format: ch-<mangaId>-<number>
export function mockReader(chapterId: string): Promise<ReaderResponse> {
  const match = chapterId.match(/^ch-(.+)-(\d+)$/);
  if (!match) throw new Error("Chapter tidak ditemukan.");
  const [, mangaId, numRaw] = match;
  const chapterNumber = Number(numRaw);
  const totalImages = 8;
  const images = Array.from(
    { length: totalImages },
    (_, i) => `https://picsum.photos/seed/${chapterId}-${i}/800/1200`
  );

  const found = mockMangas.find(
    (m) => m.mangaId === mangaId || m.mangaId === `manga-${mangaId}`
  );
  const mangaTitle = found?.title ?? mangaId;
  const thumbnail = found?.cover ?? images[0];

  return delay({
    data: {
      chapterId,
      mangaId,
      mangaTitle,
      chapterNumber,
      chapterTitle: null,
      thumbnail,
      views: 5200,
      releaseDate: "2026-09-20",
      prevChapter:
        chapterNumber > 1
          ? { chapterId: `ch-${mangaId}-${chapterNumber - 1}`, chapterNumber: chapterNumber - 1 }
          : null,
      nextChapter: {
        chapterId: `ch-${mangaId}-${chapterNumber + 1}`,
        chapterNumber: chapterNumber + 1,
      },
      images,
      totalImages,
    },
  });
}
