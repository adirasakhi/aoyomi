import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ReadingProgress {
  mangaId: string;
  mangaTitle?: string;
  cover?: string | null;
  chapterId: string;
  chapterNumber: number;
  imageIndex: number;
  totalImages?: number;
  updatedAt: string;
}

interface ProgressState {
  items: Record<string, ReadingProgress>;
  readChapters: Record<string, Record<number, true>>;
  save: (p: Omit<ReadingProgress, "updatedAt">) => void;
  markChapterRead: (mangaId: string, chapterNumber: number) => void;
  isChapterRead: (mangaId: string, chapterNumber: number) => boolean;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      items: {},
      readChapters: {},
      save: (p) =>
        set((s) => ({
          items: {
            ...s.items,
            [p.mangaId]: { ...p, updatedAt: new Date().toISOString() },
          },
          readChapters: {
            ...s.readChapters,
            [p.mangaId]: {
              ...(s.readChapters[p.mangaId] ?? {}),
              [p.chapterNumber]: true,
            },
          },
        })),
      markChapterRead: (mangaId, chapterNumber) =>
        set((s) => ({
          readChapters: {
            ...s.readChapters,
            [mangaId]: {
              ...(s.readChapters[mangaId] ?? {}),
              [chapterNumber]: true,
            },
          },
        })),
      isChapterRead: (mangaId, chapterNumber) =>
        Boolean(get().readChapters[mangaId]?.[chapterNumber]),
    }),
    { name: "manga-progress" }
  )
);
