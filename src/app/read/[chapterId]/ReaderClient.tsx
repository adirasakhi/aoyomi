"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Header, MobileNav } from "@/components/layout/Chrome";
import { ReaderImage } from "@/components/reader/ReaderImage";
import { ReaderNav } from "@/components/reader/ReaderNav";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/States";
import { useReader, useMangaDetail } from "@/lib/api/hooks";
import { useProgress } from "@/lib/store/progress";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function ReaderView({ chapterId }: { chapterId: string }) {
  const query = useReader(chapterId);
  const mangaId = query.data?.data.mangaId ?? "";
  const detailQuery = useMangaDetail(mangaId);
  const save = useProgress((s) => s.save);
  const sentinel = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const mangaTitle = detailQuery.data?.data.title ?? query.data?.data.mangaTitle;
  const mangaCover =
    detailQuery.data?.data.cover ??
    detailQuery.data?.data.coverPortrait ??
    query.data?.data.thumbnail ??
    undefined;

  const images = query.data?.data.images ?? [];
  const total = query.data?.data.totalImages ?? 0;
  const pct = total > 0 ? Math.min(100, Math.round(((activeIndex + 1) / total) * 100)) : 0;

  // Persist the opened chapter. Remounted per chapter via key, so index starts at 0.
  useEffect(() => {
    if (!query.data?.data) return;
    const d = query.data.data;
    save({
      mangaId: d.mangaId,
      mangaTitle: mangaTitle || undefined,
      cover: mangaCover,
      chapterId: d.chapterId,
      chapterNumber: d.chapterNumber,
      imageIndex: 0,
      totalImages: d.totalImages,
    });
  }, [query.data, mangaTitle, mangaCover, save]);

  // Track which page crosses the viewport middle; persist it as progress.
  useEffect(() => {
    if (!query.data?.data) return;
    const d = query.data.data;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.index ?? 0);
          setActiveIndex(i);
          save({
            mangaId: d.mangaId,
            mangaTitle: mangaTitle || undefined,
            cover: mangaCover,
            chapterId: d.chapterId,
            chapterNumber: d.chapterNumber,
            imageIndex: i,
            totalImages: d.totalImages,
          });
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    pageRefs.current.forEach((el) => {
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [query.data, mangaTitle, mangaCover, save]);

  // Mark chapter fully read at the bottom sentinel.
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !query.data?.data) return;
    const d = query.data.data;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        save({
          mangaId: d.mangaId,
          mangaTitle: mangaTitle || undefined,
          cover: mangaCover,
          chapterId: d.chapterId,
          chapterNumber: d.chapterNumber,
          imageIndex: Math.max(0, d.totalImages - 1),
          totalImages: d.totalImages,
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [query.data, mangaTitle, mangaCover, save]);

  const scrollTo = useCallback((i: number) => {
    const el = pageRefs.current[i];
    if (!el) return;
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  // Keyboard: arrows move between pages. Ignored while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setActiveIndex((cur) => {
          const next = Math.min(cur + 1, pageRefs.current.length - 1);
          scrollTo(next);
          return next;
        });
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveIndex((cur) => {
          const prev = Math.max(cur - 1, 0);
          scrollTo(prev);
          return prev;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollTo]);

  return (
    <>
      <Header />
      <main className="reader-container pb-24 md:pb-12 flex-1 w-full">
        {query.isPending ? (
          <div className="space-y-4" aria-label="Memuat chapter">
            <Skeleton className="h-8 w-1/2" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-full aspect-[2/3]" />
            ))}
          </div>
        ) : query.isError ? (
          <ErrorState message="Chapter tidak ditemukan." onRetry={() => query.refetch()} />
        ) : (
          <>
            <div className="sticky top-[57px] z-[100] bg-background/95 backdrop-blur border-b border-border -mx-4 px-4 py-3 mb-4">
              <div className="flex items-center gap-3">
                <Link href={`/manga/${query.data.data.mangaId}`} className="btn btn-ghost tap-target px-2" aria-label="Kembali ke daftar chapter">
                  ←
                </Link>
                <div className="min-w-0 flex-1">
                  {mangaTitle ? (
                    <p className="text-micro text-text-secondary line-clamp-1">{mangaTitle}</p>
                  ) : null}
                  <h1 className="text-h2 text-mono">Ch {query.data.data.chapterNumber}</h1>
                </div>
                <span className="text-micro ml-auto shrink-0" aria-live="polite">
                  {activeIndex + 1} / {query.data.data.totalImages}
                </span>
              </div>
              <div
                className="h-1 bg-surface rounded-full mt-2 overflow-hidden"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progress membaca ${pct} persen`}
              >
                <div className="h-full bg-primary transition-[width]" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              {images.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  data-index={i}
                  ref={(el) => {
                    pageRefs.current[i] = el;
                  }}
                >
                  <ReaderImage src={src} alt={`Halaman ${i + 1} chapter ${query.data.data.chapterNumber}`} index={i} />
                </div>
              ))}
            </div>
            <div ref={sentinel} aria-hidden className="h-px" />
            <ReaderNav chapter={query.data.data} mangaId={query.data.data.mangaId} />
            <p className="text-micro mt-4 text-center">
              Tips: tombol panah atas/bawah pindah halaman.
            </p>
          </>
        )}
      </main>
      <MobileNav />
    </>
  );
}
