"use client";

import Link from "next/link";
import { Check, Calendar, ChevronRight, BookOpen } from "lucide-react";
import type { Chapter } from "@/types/manga";
import { formatDateID } from "@/lib/utils";
import { useProgress } from "@/lib/store/progress";

export function ChapterList({ chapters, mangaId }: { chapters: Chapter[]; mangaId: string }) {
  const isRead = useProgress((s) => s.isChapterRead);
  if (!chapters.length) return null;

  return (
    <ol className="card-glass divide-y divide-border/60" aria-label="Daftar chapter">
      {chapters.map((c, i) => {
        const read = isRead(mangaId, c.chapterNumber);
        return (
          <li key={c.chapterId || `ch-${c.chapterNumber}-${i}`}>
            <Link
              href={`/read/${c.chapterId}`}
              className={`group flex items-center justify-between gap-3 px-4 py-3.5 sm:py-4 transition-all duration-200 tap-target ${
                read
                  ? "bg-surface/30 hover:bg-surface-elevated/70 text-text-secondary"
                  : "hover:bg-primary/[0.06] text-text-primary"
              }`}
              aria-label={`Baca chapter ${c.chapterNumber}${read ? " (sudah dibaca)" : ""}`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Status Dot / Checkmark */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] transition-colors ${
                    read
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-primary/10 text-primary border border-primary/30 group-hover:bg-primary group-hover:text-background"
                  }`}
                  aria-hidden
                >
                  {read ? <Check size={12} strokeWidth={3} /> : <BookOpen size={11} />}
                </div>

                {/* Chapter Number & Title */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-mono font-bold ${
                        read ? "text-text-muted" : "text-text-primary group-hover:text-primary transition-colors"
                      }`}
                    >
                      Chapter {c.chapterNumber}
                    </span>
                    {read && (
                      <span className="badge badge-success text-[10px] py-0 px-1.5">
                        Dibaca
                      </span>
                    )}
                  </div>
                  {c.chapterTitle ? (
                    <p className="text-meta text-xs line-clamp-1 mt-0.5 text-text-muted">
                      {c.chapterTitle}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Release Date & Chevron */}
              <div className="flex items-center gap-3 shrink-0">
                {formatDateID(c.releaseDate) ? (
                  <span className="text-micro text-text-muted text-[11px] font-mono hidden sm:inline-flex items-center gap-1">
                    <Calendar size={11} />
                    {formatDateID(c.releaseDate)}
                  </span>
                ) : null}
                <ChevronRight
                  size={16}
                  className="text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                  aria-hidden
                />
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

