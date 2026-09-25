"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    .slice(0, 5);
  if (!list.length) return null;

  return (
    <section aria-label="Continue Reading" className="mt-8">
      <h2 className="text-h2 mb-4">Continue Reading</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {list.map((p) => {
          const title = formatMangaTitle(p.mangaTitle, p.mangaId);
          const total = p.totalImages ?? 0;
          const pct =
            total > 0 ? Math.min(100, Math.round(((p.imageIndex + 1) / total) * 100)) : 0;
          return (
            <Link
              key={p.mangaId}
              href={`/read/${p.chapterId}`}
              className="card px-4 py-3 flex items-center gap-3 hover:border-text-secondary"
              aria-label={`Lanjutkan ${title} chapter ${p.chapterNumber}${
                total > 0 ? `, ${pct} persen` : ""
              }`}
            >
              <div className="relative w-10 h-14 overflow-hidden rounded bg-surface-elevated shrink-0">
                <CoverImage src={p.cover} alt={`Cover ${title}`} sizes="40px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium line-clamp-1">{title}</p>
                <p className="text-micro text-mono mt-0.5">
                  Ch {p.chapterNumber}
                  {total > 0 ? ` · ${p.imageIndex + 1}/${total}` : ""}
                </p>
                {total > 0 ? (
                  <div
                    className="h-1 bg-surface-elevated rounded-full mt-2 overflow-hidden"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Progress ${pct} persen`}
                  >
                    <div className="h-full bg-primary transition-[width]" style={{ width: `${pct}%` }} />
                  </div>
                ) : null}
              </div>
              <ArrowRight size={18} aria-hidden className="shrink-0 text-text-secondary" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
