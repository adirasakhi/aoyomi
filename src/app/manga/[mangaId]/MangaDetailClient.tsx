"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Star,
  BookOpen,
  ArrowUpDown,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Play,
  Layers,
} from "lucide-react";
import Image from "next/image";
import { Header, Footer, MobileNav } from "@/components/layout/Chrome";
import { CoverImage } from "@/components/ui/CoverImage";
import { ChapterList } from "@/components/manga/ChapterList";
import { BookmarkButton } from "@/components/manga/BookmarkButton";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { Pagination } from "@/components/ui/Pagination";
import { useMangaDetail, useChapters } from "@/lib/api/hooks";
import { useProgress } from "@/lib/store/progress";
import { proxied } from "@/lib/images";

export function MangaDetailView({ mangaId }: { mangaId: string }) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const router = useRouter();
  const detail = useMangaDetail(mangaId);
  const chapters = useChapters(mangaId, page);
  const isChapterRead = useProgress((s) => s.isChapterRead);
  const userProgress = useProgress((s) => s.items[mangaId]);

  // Determine Chapter 1 ID (Starts from Chapter 1)
  const firstChapterId = useMemo(() => {
    if (detail.data?.data.firstChapter?.chapterId) {
      return detail.data.data.firstChapter.chapterId;
    }
    const list = chapters.data?.data ?? [];
    if (list.length > 0) {
      const ch1 = list.find((c) => c.chapterNumber === 1);
      if (ch1?.chapterId) return ch1.chapterId;
      const sorted = [...list].sort((a, b) => a.chapterNumber - b.chapterNumber);
      if (sorted[0]?.chapterId) return sorted[0].chapterId;
    }
    return `ch-${mangaId}-1`;
  }, [detail.data, chapters.data, mangaId]);

  // Filter & Sort Chapters
  const visibleChapters = useMemo(() => {
    const list = chapters.data?.data ?? [];
    const q = filter.trim().toLowerCase();
    const filtered = list.filter((c) => {
      if (unreadOnly && isChapterRead(mangaId, c.chapterNumber)) return false;
      if (!q) return true;
      return (
        String(c.chapterNumber).includes(q) ||
        (c.chapterTitle ?? "").toLowerCase().includes(q)
      );
    });

    return [...filtered].sort((a, b) => {
      return sortAsc
        ? a.chapterNumber - b.chapterNumber
        : b.chapterNumber - a.chapterNumber;
    });
  }, [chapters.data, filter, unreadOnly, sortAsc, isChapterRead, mangaId]);

  const coverUrl = proxied(detail.data?.data.cover);

  return (
    <>
      <Header />
      <main className="container-wide px-4 pb-28 md:pb-12 pt-4 sm:pt-6 flex-1 w-full relative">
        {/* Dynamic Blurred Backdrop for Premium Ambient Feel */}
        {coverUrl && (
          <div className="absolute inset-x-0 -top-6 h-[340px] sm:h-[420px] overflow-hidden pointer-events-none opacity-25 filter blur-3xl -z-10">
            <Image
              src={coverUrl}
              alt=""
              fill
              className="object-cover object-top scale-125"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
          </div>
        )}

        {detail.isPending ? (
          <div className="flex flex-col sm:flex-row gap-6 p-4 rounded-2xl bg-surface/40 backdrop-blur-md border border-white/[0.06]" aria-label="Memuat detail">
            <Skeleton className="w-36 sm:w-48 aspect-[5/7] rounded-xl shrink-0 mx-auto sm:mx-0" />
            <div className="flex-1 space-y-3.5">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-24 w-full rounded-xl" />
              <div className="flex gap-3">
                <Skeleton className="h-11 w-36 rounded-xl" />
                <Skeleton className="h-11 w-28 rounded-xl" />
              </div>
            </div>
          </div>
        ) : detail.isError ? (
          <ErrorState message="Manga tidak ditemukan." onRetry={() => detail.refetch()} />
        ) : (
          <div className="card-glass p-5 sm:p-7 relative">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
              {/* Cover Artwork */}
              <div className="relative w-40 sm:w-52 aspect-[5/7] overflow-hidden rounded-2xl border border-white/[0.12] shadow-2xl shadow-black/80 shrink-0">
                <CoverImage
                  src={detail.data.data.cover}
                  alt={`Cover ${detail.data.data.title}`}
                  sizes="220px"
                  eager
                />
              </div>

              {/* Manga Details & Actions */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                {/* Title & Alternative */}
                <h1 className="text-display text-text-primary font-extrabold tracking-tight">
                  {detail.data.data.title}
                </h1>
                {detail.data.data.alternativeTitle ? (
                  <p className="text-meta text-xs sm:text-sm mt-1 text-text-muted">
                    {detail.data.data.alternativeTitle}
                  </p>
                ) : null}

                {/* Status, Rating, & Country Chips */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3.5">
                  {detail.data.data.status ? (
                    <span className="badge badge-success text-xs font-semibold">
                      ● {detail.data.data.status}
                    </span>
                  ) : null}
                  {detail.data.data.rating ? (
                    <span className="badge badge-warning text-xs font-semibold flex items-center gap-1">
                      <Star size={12} className="fill-current" /> {detail.data.data.rating}
                    </span>
                  ) : null}
                  {detail.data.data.country ? (
                    <span className="badge badge-neutral text-xs font-medium">
                      {detail.data.data.country}
                    </span>
                  ) : null}
                  {detail.data.data.releaseYear ? (
                    <span className="badge badge-neutral text-xs font-medium">
                      {detail.data.data.releaseYear}
                    </span>
                  ) : null}
                </div>

                {/* Genres */}
                {detail.data.data.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 justify-center sm:justify-start">
                    {detail.data.data.genres.map((g, i) => (
                      <Badge key={`${g.id}-${i}`} variant="primary">
                        {g.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Description (Expandable on Mobile) */}
                {detail.data.data.description ? (
                  <div className="mt-4 text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl">
                    <p className={descriptionExpanded ? "" : "line-clamp-3"}>
                      {detail.data.data.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                      className="text-primary hover:text-sky-300 font-semibold text-xs mt-1 inline-flex items-center gap-1 focus:outline-none"
                    >
                      {descriptionExpanded ? (
                        <>
                          <span>Sembunyikan</span>
                          <ChevronUp size={14} />
                        </>
                      ) : (
                        <>
                          <span>Baca selengkapnya</span>
                          <ChevronDown size={14} />
                        </>
                      )}
                    </button>
                  </div>
                ) : null}

                {/* Author Info */}
                {detail.data.data.authors.length > 0 && (
                  <p className="text-micro mt-3 text-text-muted">
                    Penulis:{" "}
                    <span className="text-text-secondary font-medium">
                      {detail.data.data.authors.map((a) => a.name).join(", ")}
                    </span>
                  </p>
                )}

                {/* Action Buttons: Mulai Baca (Ch 1) & Lanjut Baca & Bookmark */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-6">
                  {/* Mulai Membaca Button: ALWAYS STARTS FROM CHAPTER 1 */}
                  <button
                    className="btn btn-primary tap-target px-5 font-bold shadow-glow-primary flex items-center gap-2"
                    onClick={() => router.push(`/read/${firstChapterId}`)}
                  >
                    <BookOpen size={18} />
                    <span>Mulai Membaca (Ch. 1)</span>
                  </button>

                  {/* Lanjutkan Membaca (If user already has progress) */}
                  {userProgress && (
                    <button
                      className="btn btn-glass tap-target px-4 font-semibold flex items-center gap-2 text-sky-400 border-sky-500/30"
                      onClick={() => router.push(`/read/${userProgress.chapterId}`)}
                    >
                      <Play size={16} className="fill-current" />
                      <span>Lanjut Ch. {userProgress.chapterNumber}</span>
                    </button>
                  )}

                  {/* Bookmark Button */}
                  <BookmarkButton
                    mangaId={detail.data.data.mangaId}
                    title={detail.data.data.title}
                    cover={detail.data.data.cover}
                    latestChapter={detail.data.data.latestChapter?.chapterNumber ?? null}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chapters Section */}
        <section aria-label="Chapter List" className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-primary/10 text-primary">
                <Layers size={20} />
              </div>
              <h2 className="text-h2 font-bold">Daftar Chapter</h2>
              {chapters.data?.pagination.totalRecord ? (
                <span className="badge badge-neutral text-xs font-mono font-bold">
                  {chapters.data.pagination.totalRecord} Chapter
                </span>
              ) : null}
            </div>

            {/* Chapter Tools: Search Filter, Sort, and Unread Toggle */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Filter Search Input */}
              <div className="relative flex-1 sm:w-60">
                <input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="input pr-8 text-xs py-2"
                  placeholder="Filter nomor/judul chapter..."
                  aria-label="Filter chapter"
                />
                {filter && (
                  <button
                    type="button"
                    onClick={() => setFilter("")}
                    aria-label="Hapus filter chapter"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort Order Button */}
              <button
                type="button"
                onClick={() => setSortAsc(!sortAsc)}
                className={`btn text-xs py-2 px-3 tap-target flex items-center gap-1.5 ${
                  sortAsc ? "btn-primary" : "btn-secondary"
                }`}
                aria-label={sortAsc ? "Urutan dari Chapter 1 (Ascending)" : "Urutan dari Chapter Terbaru (Descending)"}
              >
                <ArrowUpDown size={14} />
                <span>{sortAsc ? "Ch 1 → N" : "Terbaru"}</span>
              </button>

              {/* Unread Only Toggle */}
              <label className="flex items-center gap-1.5 text-xs text-text-secondary px-3 py-2 rounded-xl bg-surface border border-border cursor-pointer select-none tap-target">
                <input
                  type="checkbox"
                  checked={unreadOnly}
                  onChange={(e) => setUnreadOnly(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-[#38BDF8]"
                />
                <span>Belum dibaca</span>
              </label>
            </div>
          </div>

          {/* Chapter Items List */}
          {chapters.isPending ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : chapters.isError ? (
            <ErrorState message="Gagal memuat chapter." onRetry={() => chapters.refetch()} />
          ) : chapters.data.data.length === 0 ? (
            <EmptyState title="Belum ada chapter tersedia." />
          ) : visibleChapters.length === 0 ? (
            <EmptyState
              title="Tidak ada chapter yang cocok."
              hint="Ubah kata kunci filter atau matikan opsi belum dibaca."
            />
          ) : (
            <>
              <ChapterList chapters={visibleChapters} mangaId={mangaId} />
              <Pagination
                page={chapters.data.pagination.currentPage}
                totalPages={chapters.data.pagination.totalPages}
                onChange={setPage}
              />
            </>
          )}
        </section>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}

