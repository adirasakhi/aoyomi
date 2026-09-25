import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BookmarkEntry {
  mangaId: string;
  title: string;
  cover?: string | null;
  latestChapter?: number | null;
  savedAt: string;
}

interface BookmarkState {
  items: Record<string, BookmarkEntry>;
  toggle: (entry: Omit<BookmarkEntry, "savedAt">) => void;
  remove: (mangaId: string) => void;
  has: (mangaId: string) => boolean;
}

export const useBookmarks = create<BookmarkState>()(
  persist(
    (set, get) => ({
      items: {},
      toggle: (entry) => {
        const items = { ...get().items };
        if (items[entry.mangaId]) {
          delete items[entry.mangaId];
        } else {
          items[entry.mangaId] = {
            ...entry,
            savedAt: new Date().toISOString(),
          };
        }
        set({ items });
      },
      remove: (mangaId) => {
        const items = { ...get().items };
        delete items[mangaId];
        set({ items });
      },
      has: (mangaId) => Boolean(get().items[mangaId]),
    }),
    { name: "manga-bookmarks" }
  )
);
