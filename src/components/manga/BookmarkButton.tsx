"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useBookmarks } from "@/lib/store/bookmarks";

export function BookmarkButton({
  mangaId,
  title,
  cover,
  latestChapter,
  className = "",
}: {
  mangaId: string;
  title: string;
  cover?: string | null;
  latestChapter?: number | null;
  className?: string;
}) {
  const has = useBookmarks((s) => s.has(mangaId));
  const toggle = useBookmarks((s) => s.toggle);

  return (
    <button
      onClick={() => toggle({ mangaId, title, cover, latestChapter })}
      aria-pressed={has}
      aria-label={has ? "Hapus bookmark" : "Simpan bookmark"}
      className={`btn tap-target transition-all duration-200 ${
        has
          ? "bg-primary/15 text-primary border-primary/40 shadow-sm hover:bg-primary/20"
          : "btn-secondary hover:border-text-secondary"
      } ${className}`}
    >
      {has ? (
        <BookmarkCheck size={18} className="fill-primary/20 text-primary animate-in zoom-in-50 duration-200" aria-hidden />
      ) : (
        <Bookmark size={18} aria-hidden />
      )}
      <span>{has ? "Tersimpan" : "Bookmark"}</span>
    </button>
  );
}

