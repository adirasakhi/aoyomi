"use client";

import Link from "next/link";
import type { Chapter } from "@/types/manga";
import { formatDateID } from "@/lib/utils";
import { useProgress } from "@/lib/store/progress";

export function ChapterList({ chapters, mangaId }: { chapters: Chapter[]; mangaId: string }) {
  const isRead = useProgress((s) => s.isChapterRead);
  if (!chapters.length) return null;
  return (
    <ol className="card divide-y divide-border" aria-label="Daftar chapter">
      {chapters.map((c, i) => {
        const read = isRead(mangaId, c.chapterNumber);
        return (
          <li key={c.chapterId || `ch-${c.chapterNumber}-${i}`}>
            <Link
              href={`/read/${c.chapterId}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-surface-elevated tap-target"
              aria-label={`Baca chapter ${c.chapterNumber}${read ? " (sudah dibaca)" : ""}`}
            >
              <span
                aria-hidden
                className={`h-2 w-2 rounded-full shrink-0 ${read ? "bg-success" : "bg-primary"}`}
              />
              <span className={`text-mono ${read ? "text-text-secondary" : ""}`}>
                Ch {c.chapterNumber}
              </span>
              {c.chapterTitle ? (
                <span className="text-meta line-clamp-1">{c.chapterTitle}</span>
              ) : null}
              {formatDateID(c.releaseDate) ? (
                <span className="ml-auto text-micro shrink-0">{formatDateID(c.releaseDate)}</span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
