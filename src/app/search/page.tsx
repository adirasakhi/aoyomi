"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Header, Footer, MobileNav } from "@/components/layout/Chrome";
import { MangaCard } from "@/components/home/Manga";
import { MangaCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { Pagination } from "@/components/ui/Pagination";
import { useSearch } from "@/lib/api/hooks";

const DEBOUNCE_MS = 400;

// Owns the input state. Remounted via key when the URL query changes,
// so back/forward navigation resets the field without set-state-in-effect.
function SearchForm({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [input, setInput] = useState(initialQuery);

  // Debounced live search: typing updates the URL, results follow.
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

  return (
    <form
      role="search"
      className="flex gap-2 mt-4 max-w-xl"
      onSubmit={(e) => {
        e.preventDefault();
        const value = input.trim();
        router.push(
          value ? `/search?q=${encodeURIComponent(value)}&page=1` : "/search"
        );
      }}
    >
      <div className="relative flex-1">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input pr-10"
          placeholder="Cari judul manga"
          aria-label="Cari judul manga"
        />
        {input ? (
          <button
            type="button"
            onClick={() => setInput("")}
            aria-label="Hapus pencarian"
            className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 text-text-secondary hover:text-text-primary"
          >
            <X size={16} aria-hidden />
          </button>
        ) : null}
      </div>
      <button type="submit" className="btn btn-primary tap-target">
        Cari
      </button>
    </form>
  );
}

function SearchBody() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") ?? "";
  const page = Number(params.get("page") ?? "1") || 1;
  const search = useSearch(q, page);

  return (
    <main className="container-wide px-4 pb-24 md:pb-12 pt-6 flex-1 w-full">
      <h1 className="text-h1">Search</h1>
      <SearchForm key={q} initialQuery={q} />

      <div className="mt-6" aria-live="polite">
        {!q ? (
          <EmptyState title="Ketik kata kunci untuk mencari." />
        ) : search.isPending ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" aria-label="Memuat hasil">
            {Array.from({ length: 8 }).map((_, i) => (
              <MangaCardSkeleton key={i} />
            ))}
          </div>
        ) : search.isError ? (
          <ErrorState message="Gagal mengambil data." onRetry={() => search.refetch()} />
        ) : search.data.data.length === 0 ? (
          <EmptyState title="Komik tidak ditemukan." hint="Coba gunakan kata kunci lain." />
        ) : (
          <>
            <p className="text-meta mb-4">
              {search.data.pagination.totalRecord} hasil untuk “{search.data.query}”
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
