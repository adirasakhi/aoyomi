"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X, Search, Sparkles, Compass } from "lucide-react";
import { Header, Footer, MobileNav } from "@/components/layout/Chrome";
import { MangaCard } from "@/components/home/Manga";
import { MangaCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { Pagination } from "@/components/ui/Pagination";
import { useSearch } from "@/lib/api/hooks";

const DEBOUNCE_MS = 400;

const POPULAR_TAGS = [
  "Solo Leveling",
  "Action",
  "Romance",
  "Fantasy",
  "Isekai",
  "Martial Arts",
  "Magic",
  "Adventure",
  "Comedy",
  "Reincarnation",
];

function SearchForm({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [input, setInput] = useState(initialQuery);

  useEffect(() => {
    const value = input.trim();
    if (value === initialQuery) return;
    const t = setTimeout(() => {
      if (value) {
        router.replace(`/search?q=${encodeURIComponent(value)}&page=1`);
      } else {
        router.replace("/search");
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [input, initialQuery, router]);

  const handleTagClick = (tag: string) => {
    setInput(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}&page=1`);
  };

  return (
    <div className="mt-4 max-w-2xl">
      <form
        role="search"
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const value = input.trim();
          router.push(
            value ? `/search?q=${encodeURIComponent(value)}&page=1` : "/search"
          );
        }}
      >
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            aria-hidden
          />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input pl-10 pr-10 text-sm py-3 rounded-xl bg-surface/90 backdrop-blur-md"
            placeholder="Cari judul komik, genre, atau kata kunci..."
            aria-label="Cari judul manga"
          />
          {input ? (
            <button
              type="button"
              onClick={() => setInput("")}
              aria-label="Hapus pencarian"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 text-text-muted hover:text-text-primary p-1"
            >
              <X size={16} aria-hidden />
            </button>
          ) : null}
        </div>
        <button type="submit" className="btn btn-primary px-5 tap-target shadow-glow-primary font-bold">
          Cari
        </button>
      </form>

      {/* Quick Search Tags */}
      <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar pb-1">
        <span className="text-micro text-text-muted flex items-center gap-1 shrink-0 mr-1">
          <Sparkles size={12} className="text-primary" /> Populer:
        </span>
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className="text-xs px-2.5 py-1 rounded-full bg-surface border border-white/[0.08] hover:border-primary/40 hover:text-primary text-text-secondary whitespace-nowrap transition-colors shrink-0"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

function SearchBody() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") ?? "";
  const page = Number(params.get("page") ?? "1") || 1;
  const search = useSearch(q, page);

  return (
    <main className="container-wide px-4 pb-28 md:pb-12 pt-4 sm:pt-6 flex-1 w-full">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
          <Compass size={22} />
        </div>
        <h1 className="text-h1 font-extrabold">Eksplorasi & Pencarian</h1>
      </div>

      <SearchForm key={q} initialQuery={q} />

      <div className="mt-8" aria-live="polite">
        {!q ? (
          <EmptyState
            title="Ketik kata kunci untuk mencari manga."
            hint="Atau pilih salah satu tag populer di atas untuk langsung menjelajah."
          />
        ) : search.isPending ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4" aria-label="Memuat hasil">
            {Array.from({ length: 10 }).map((_, i) => (
              <MangaCardSkeleton key={i} />
            ))}
          </div>
        ) : search.isError ? (
          <ErrorState message="Gagal mengambil data." onRetry={() => search.refetch()} />
        ) : search.data.data.length === 0 ? (
          <EmptyState title="Komik tidak ditemukan." hint="Coba gunakan kata kunci atau nama alternatif lain." />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-meta text-xs sm:text-sm font-medium">
                Ditemukan <span className="text-primary font-bold">{search.data.pagination.totalRecord}</span> hasil untuk “{search.data.query}”
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {search.data.data.map((m) => (
                <MangaCard key={m.mangaId} manga={m} />
              ))}
            </div>
            <Pagination
              page={search.data.pagination.currentPage}
              totalPages={search.data.pagination.totalPages}
              onChange={(p) => router.push(`/search?q=${encodeURIComponent(q)}&page=${p}`)}
            />
          </>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <Suspense>
        <SearchBody />
      </Suspense>
      <Footer />
      <MobileNav />
    </>
  );
}

