"use client";

import Link from "next/link";
import { CoverImage } from "@/components/ui/CoverImage";
import { useBookmarks } from "@/lib/store/bookmarks";
import { EmptyState } from "@/components/ui/States";

export function BookmarkList() {
  const items = useBookmarks((s) => s.items);
  const remove = useBookmarks((s) => s.remove);
  const list = Object.values(items).sort((a, b) => b.savedAt.localeCompare(a.savedAt));

  if (!list.length) {
    return <EmptyState title="Belum ada komik yang disimpan." hint="Buka halaman detail lalu tekan Bookmark." />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {list.map((b) => (
        <div key={b.mangaId} className="card p-3">
          <Link href={`/manga/${b.mangaId}`} className="block" aria-label={`Buka ${b.title}`}>
            <div className="relative aspect-[5/7] overflow-hidden rounded-md bg-surface-elevated">
              <CoverImage src={b.cover} alt={`Cover ${b.title}`} sizes="25vw" />
            </div>
            <p className="mt-3 font-medium line-clamp-1">{b.title}</p>
          </Link>
          <button onClick={() => remove(b.mangaId)} className="btn btn-ghost tap-target mt-1 px-0" aria-label={`Hapus ${b.title} dari bookmark`}>
            Hapus
          </button>
        </div>
      ))}
    </div>
  );
}
