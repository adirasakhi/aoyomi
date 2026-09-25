"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useBookmarks } from "@/lib/store/bookmarks";

export function BookmarkButton({
  mangaId,
  title,
  cover,
  latestChapter,
}: {
  mangaId: string;
  title: string;
  cover?: string | null;
  latestChapter?: number | null;
}) {
  const has = useBookmarks((s) => s.has(mangaId));
  const toggle = useBookmarks((s) => s.toggle);

  return (
    <button
      onClick={() => toggle({ mangaId, title, cover, latestChapter })}
      aria-pressed={has}
      aria-label={has ? "Hapus bookmark" : "Simpan bookmark"}
      className="btn btn-secondary tap-target"
    >
      {has ? <BookmarkCheck size={18} aria-hidden /> : <Bookmark size={18} aria-hidden />}
      {has ? "Saved" : "Bookmark"}
    </button>
  );
}
