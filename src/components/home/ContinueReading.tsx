"use client";

import Link from "next/link";
import { History, Play, ChevronRight } from "lucide-react";
import { CoverImage } from "@/components/ui/CoverImage";
import { useProgress } from "@/lib/store/progress";

function formatMangaTitle(title?: string | null, mangaId?: string): string {
  if (title && title.trim() && title !== mangaId && !title.startsWith("manga-")) {
    return title;
  }
  const raw = (title || mangaId || "").replace(/^manga-/, "");
  if (!raw) return "Komik";
  return raw
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function ContinueReading() {
  const items = useProgress((s) => s.items);
  const list = Object.values(items)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6);
  if (!list.length) return null;

  return (
    <section aria-label="Continue Reading" className="mt-8">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-primary/10 text-primary">
            <History size={18} />
          </div>
          <h2 className="text-h2 font-bold">Lanjutkan Membaca</h2>
          <span className="badge badge-primary text-[10px] py-0 px-1.5 ml-1">
            {list.length}
          </span>
        </div>
      </div>

      {/* Responsive: Horizontal swipe on mobile, grid on desktop */}
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
        {list.map((p) => {
          const title = formatMangaTitle(p.mangaTitle, p.mangaId);
          const total = p.totalImages ?? 0;
          const pct =
            total > 0 ? Math.min(100, Math.round(((p.imageIndex + 1) / total) * 100)) : 0;

          return (
            <Link
              key={p.mangaId}
              href={`/read/${p.chapterId}`}
              className="group card-glass p-3 flex items-center gap-3.5 min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-start shrink-0 relative overflow-hidden transition-all duration-300"
              aria-label={`Lanjutkan ${title} chapter ${p.chapterNumber}${
                total > 0 ? `, ${pct} persen` : ""
              }`}
            >
              {/* Cover thumbnail */}
              <div className="relative w-12 h-16 overflow-hidden rounded-lg bg-surface-elevated shrink-0 border border-white/[0.08] shadow-md group-hover:scale-105 transition-transform duration-200">
                <CoverImage src={p.cover} alt={`Cover ${title}`} sizes="48px" />
              </div>

              {/* Info & Progress */}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm line-clamp-1 text-text-primary group-hover:text-primary transition-colors">
                  {title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="badge badge-neutral text-[10px] py-0 px-1.5 font-mono">
                    Ch {p.chapterNumber}
                  </span>
                  {total > 0 ? (
                    <span className="text-micro text-text-muted text-[11px] font-mono">
                      {p.imageIndex + 1}/{total} ({pct}%)
                    </span>
                  ) : null}
                </div>

                {/* Progress bar */}
                {total > 0 ? (
                  <div
                    className="h-1.5 w-full bg-surface-elevated/80 rounded-full mt-2 overflow-hidden border border-white/[0.04]"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Progress ${pct} persen`}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full shadow-[0_0_6px_#38BDF8]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                ) : null}
              </div>

              {/* Resume play button */}
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-background transition-all duration-200 group-hover:scale-110 shadow-sm">
                <Play size={14} className="fill-current ml-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

