"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { SliderItem } from "@/types/manga";
import { Badge } from "@/components/ui/Badge";
import { CoverImage } from "@/components/ui/CoverImage";

const AUTOPLAY_MS = 6000;

export function HeroSlider({ items }: { items: SliderItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = items.length;

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count),
    [count]
  );

  useEffect(() => {
    if (paused || count <= 1) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, count]);

  if (!items.length) return null;
  const active = items[index % count];

  return (
    <section
      aria-label="Featured"
      aria-roledescription="carousel"
      className="relative overflow-hidden rounded-xl border border-border"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="relative h-[340px] md:h-[420px]">
        {items.map((s, i) => (
          <Image
            key={s.id || `${s.mangaId}-${i}`}
            src={s.backgroundImage}
            alt=""
            aria-hidden={i !== index}
            fill
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
            sizes="100vw"
            referrerPolicy="no-referrer"
            className={`object-cover transition-opacity duration-500 ${
              i === index % count ? "opacity-40" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 flex gap-5 md:items-end">
          <div className="flex-1 min-w-0" aria-live="polite">
            <div className="flex gap-2 mb-2">
              {active.badges.map((b, i) => (
                <Badge key={`${b.name}-${i}`} variant="warning">
                  {b.name}
                </Badge>
              ))}
              {typeof active.rating === "number" && Number.isFinite(active.rating) ? (
                <span className="badge badge-neutral">
                  <Star size={12} aria-hidden /> {active.rating.toFixed(1)}
                </span>
              ) : null}
            </div>
            <h1 key={active.id} className="text-display line-clamp-2 min-h-[2.4em]">
              {active.title}
            </h1>
            <p className="text-meta mt-2 line-clamp-2 max-w-2xl min-h-[3em]">{active.description}</p>
            <div className="flex gap-2 mt-4 items-center flex-wrap">
              <Link href={`/manga/${active.mangaId}`} className="btn btn-primary tap-target">
                Mulai membaca
              </Link>
              <div className="flex ml-auto items-center">
                <button
                  onClick={() => go(-1)}
                  aria-label="Featured sebelumnya"
                  className="flex items-center justify-center w-11 h-11 text-text-secondary hover:text-text-primary"
                >
                  <ChevronLeft size={20} aria-hidden />
                </button>
                <div className="flex items-center" role="tablist" aria-label="Featured selector">
                {items.map((s, i) => (
                  <button
                    key={s.id || `${s.mangaId}-${i}`}
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Tampilkan ${s.title}`}
                      onClick={() => setIndex(i)}
                      className="flex items-center justify-center w-8 h-11"
                    >
                      <span
                        aria-hidden
                        className={`h-2 rounded-full transition-all ${
                          i === index ? "w-6 bg-primary" : "w-3 bg-border hover:bg-text-secondary"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => go(1)}
                  aria-label="Featured berikutnya"
                  className="flex items-center justify-center w-11 h-11 text-text-secondary hover:text-text-primary"
                >
                  <ChevronRight size={20} aria-hidden />
                </button>
                <span className="text-micro text-mono ml-1" aria-hidden>
                  {index + 1}/{count}
                </span>
              </div>
            </div>
          </div>
          {active.charaImage ? (
            <div className="relative hidden md:block w-44 h-64 shrink-0 rounded-lg overflow-hidden border border-border">
              <CoverImage
                src={active.charaImage}
                alt={`Karakter ${active.title}`}
                sizes="176px"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
