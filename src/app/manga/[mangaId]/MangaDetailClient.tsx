"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useMemo } from "react";
import { Header, Footer, MobileNav } from "@/components/layout/Chrome";
import { ChapterList } from "@/components/manga/ChapterList";
import { BookmarkButton } from "@/components/manga/BookmarkButton";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { Pagination } from "@/components/ui/Pagination";
import { useMangaDetail, useChapters } from "@/lib/api/hooks";
import { useProgress } from "@/lib/store/progress";

export function MangaDetailView({ mangaId }: { mangaId: string }) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const router = useRouter();
  const detail = useMangaDetail(mangaId);
  const chapters = useChapters(mangaId, page);
  const isChapterRead = useProgress((s) => s.isChapterRead);

  const visibleChapters = useMemo(() => {
    const list = chapters.data?.data ?? [];
    const q = filter.trim().toLowerCase();
    return list.filter((c) => {
      if (unreadOnly && isChapterRead(mangaId, c.chapterNumber)) return false;
      if (!q) return true;
      return (
        String(c.chapterNumber).includes(q) ||
        (c.chapterTitle ?? "").toLowerCase().includes(q)
      );
    });
  }, [chapters.data, filter, unreadOnly, isChapterRead, mangaId]);

  return (
    <>
      <Header />
      <main className="container-wide px-4 pb-24 md:pb-12 pt-6 flex-1 w-full">
        {detail.isPending ? (
          <div className="flex gap-5" aria-label="Memuat detail">
            <Skeleton className="w-36 md:w-48 aspect-[5/7] shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : detail.isError ? (
          <ErrorState message="Manga tidak ditemukan." onRetry={() => detail.refetch()} />
        ) : (
          <div className="flex flex-col md:flex-row gap-5">
            <div className="relative w-36 md:w-48 aspect-[5/7] overflow-hidden rounded-lg border border-border shrink-0">
              {detail.data.data.cover ? (
                <Image
                  src={detail.data.data.cover}
                  alt={`Cover ${detail.data.data.title}`}
                  fill
                  sizes="200px"
                  className="object-cover"
                  priority
                />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-h1 line-clamp-2">{detail.data.data.title}</h1>
              {detail.data.data.alternativeTitle ? (
                <p className="text-meta mt-1">{detail.data.data.alternativeTitle}</p>
              ) : null}
              <div className="flex flex-wrap gap-2 mt-3">
                {detail.data.data.status ? <Badge variant="neutral">{detail.data.data.status}</Badge> : null}
                {detail.data.data.rating ? <Badge variant="warning">★ {detail.data.data.rating}</Badge> : null}
                {detail.data.data.genres.map((g, i) => (
                  <Badge key={`${g.id}-${i}`}>{g.name}</Badge>
                ))}
              </div>
              {detail.data.data.description ? (
                <p className="text-body-sm mt-4 max-w-3xl">{detail.data.data.description}</p>
              ) : null}
              <p className="text-micro mt-3">
                {detail.data.data.authors.map((a) => a.name).join(", ")}
                {detail.data.data.releaseYear ? ` · ${detail.data.data.releaseYear}` : ""}
                {detail.data.data.country ? ` · ${detail.data.data.country}` : ""}
              </p>
              <div className="flex gap-2 mt-4">
                <BookmarkButton
                  mangaId={detail.data.data.mangaId}
                  title={detail.data.data.title}
                  cover={detail.data.data.cover}
                  latestChapter={detail.data.data.latestChapter?.chapterNumber ?? null}
                />
                {detail.data.data.latestChapter?.chapterId ? (
                  <button
                    className="btn btn-primary tap-target"
                    onClick={() => router.push(`/read/${detail.data.data.latestChapter!.chapterId}`)}
                  >
                    Mulai membaca
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        )}

        <section aria-label="Chapter" className="mt-8">
          <h2 className="text-h2 mb-4">Chapters</h2>
          {chapters.isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : chapters.isError ? (
            <ErrorState message="Gagal memuat chapter." onRetry={() => chapters.refetch()} />
          ) : chapters.data.data.length === 0 ? (
            <EmptyState title="Belum ada chapter." />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-4">
                <div className="relative flex-1 max-w-sm">
                  <input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="input pr-10"
                    placeholder="Filter nomor atau judul chapter"
                    aria-label="Filter chapter"
                  />
                  {filter ? (
                    <button
                      type="button"
                      onClick={() => setFilter("")}
                      aria-label="Hapus filter chapter"
                      className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 text-text-secondary hover:text-text-primary"
                    >
                      <X size={16} aria-hidden />
                    </button>
                  ) : null}
                </div>
                <label className="flex items-center gap-2 text-meta tap-target cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={unreadOnly}
                    onChange={(e) => setUnreadOnly(e.target.checked)}
                    className="w-4 h-4 accent-[#58A6FF]"
                  />
                  Belum dibaca saja
                </label>
                {(filter || unreadOnly) && (
                  <span className="text-micro sm:ml-auto" aria-live="polite">
                    {visibleChapters.length} dari {chapters.data.data.length} di halaman ini
                  </span>
                )}
              </div>
              {visibleChapters.length === 0 ? (
                <EmptyState
                  title="Tidak ada chapter yang cocok."
                  hint="Ubah filter atau matikan opsi belum dibaca."
                />
              ) : (
                <ChapterList chapters={visibleChapters} mangaId={mangaId} />
              )}
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
