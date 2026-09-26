"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star, BookOpen, Sparkles } from "lucide-react";
import type { SliderItem } from "@/types/manga";
import { Badge } from "@/components/ui/Badge";
import { CoverImage } from "@/components/ui/CoverImage";
import { proxied } from "@/lib/images";

const AUTOPLAY_MS = 6000;

export function HeroSlider({ items }: { items: SliderItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = items.length;

  // Touch swipe handling for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count),
    [count]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      go(1);
    } else if (distance < -minSwipeDistance) {
      go(-1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

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
      className="relative overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="relative min-h-[360px] sm:h-[400px] md:h-[440px] flex flex-col justify-end">
        {/* Background Artwork */}
        {items.map((s, i) => {
          const bg = proxied(s.backgroundImage);
          if (!bg) return null;
          const isActive = i === index % count;
          return (
            <div
              key={s.id || `${s.mangaId}-${i}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <Image
                src={bg}
                alt=""
                aria-hidden={!isActive}
                fill
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                sizes="100vw"
                referrerPolicy="no-referrer"
                className="object-cover object-top filter brightness-[0.55] sm:brightness-[0.65] contrast-[1.05]"
              />
            </div>
          );
        })}

        {/* Ambient Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

        {/* Content Container */}
        <div className="relative z-10 p-5 sm:p-6 md:p-8 flex gap-6 md:items-end">
          <div className="flex-1 min-w-0" aria-live="polite">
            {/* Badges & Rating */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="badge badge-primary flex items-center gap-1">
                <Sparkles size={12} />
                Featured
              </span>
              {active.badges.map((b, i) => (
                <Badge key={`${b.name}-${i}`} variant="warning">
                  {b.name}
                </Badge>
              ))}
              {typeof active.rating === "number" && Number.isFinite(active.rating) && (
                <span className="badge badge-glass flex items-center gap-1 font-mono text-amber-300">
                  <Star size={12} className="fill-amber-400 text-amber-400" aria-hidden />{" "}
                  {active.rating.toFixed(1)}
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              key={active.id}
              className="text-display line-clamp-2 text-text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              {active.title}
            </h1>

            {/* Description */}
            <p className="text-meta text-xs sm:text-sm mt-2 line-clamp-2 max-w-2xl text-slate-300 drop-shadow-sm">
              {active.description}
            </p>

            {/* Action Bar & Slider Controls */}
            <div className="flex items-center gap-3 mt-5 flex-wrap justify-between">
              <div className="flex items-center gap-2.5">
                <Link
                  href={`/manga/${active.mangaId}`}
                  className="btn btn-primary tap-target shadow-glow-primary flex items-center gap-2 font-bold px-5"
                >
                  <BookOpen size={17} />
                  <span>Mulai membaca</span>
                </Link>
                <Link
                  href={`/manga/${active.mangaId}`}
                  className="btn btn-glass tap-target hidden sm:inline-flex text-xs font-semibold px-4"
                >
                  Detail
                </Link>
              </div>

              {/* Slider Dots & Arrow Navigation */}
              <div className="flex items-center gap-1 bg-surface/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/[0.08]">
                <button
                  onClick={() => go(-1)}
                  aria-label="Featured sebelumnya"
                  className="flex items-center justify-center w-8 h-8 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft size={18} aria-hidden />
                </button>

                <div className="flex items-center gap-1.5 px-1" role="tablist" aria-label="Featured selector">
                  {items.map((s, i) => (
                    <button
                      key={s.id || `${s.mangaId}-${i}`}
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Tampilkan ${s.title}`}
                      onClick={() => setIndex(i)}
                      className="p-1 focus:outline-none"
                    >
                      <span
                        aria-hidden
                        className={`block h-1.5 rounded-full transition-all duration-300 ${
                          i === index
                            ? "w-6 bg-gradient-to-r from-sky-400 to-indigo-500 shadow-[0_0_8px_#38BDF8]"
                            : "w-2 bg-white/20 hover:bg-white/40"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => go(1)}
                  aria-label="Featured berikutnya"
                  className="flex items-center justify-center w-8 h-8 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
                >
                  <ChevronRight size={18} aria-hidden />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Right Character Cover Art */}
          {active.charaImage ? (
            <div className="relative hidden md:block w-40 h-56 lg:w-48 lg:h-64 shrink-0 rounded-xl overflow-hidden border border-white/[0.12] shadow-2xl shadow-black/80 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <CoverImage
                src={active.charaImage}
                alt={`Karakter ${active.title}`}
                sizes="192px"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

