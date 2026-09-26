import Link from "next/link";
import { ChevronLeft, ChevronRight, ListOrdered } from "lucide-react";
import type { ReaderChapter } from "@/types/manga";

export function ReaderNav({ chapter, mangaId }: { chapter: ReaderChapter; mangaId: string }) {
  return (
    <nav aria-label="Navigasi chapter" className="mt-10 p-4 rounded-2xl card-glass border border-white/[0.08]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {chapter.prevChapter ? (
          <Link
            href={`/read/${chapter.prevChapter.chapterId}`}
            className="btn btn-secondary tap-target w-full sm:w-auto flex items-center justify-center gap-1.5"
          >
            <ChevronLeft size={16} />
            <span>Prev Ch {chapter.prevChapter.chapterNumber}</span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        <Link
          href={`/manga/${mangaId}`}
          className="btn btn-glass tap-target w-full sm:w-auto flex items-center justify-center gap-1.5"
        >
          <ListOrdered size={16} />
          <span>Daftar Chapter</span>
        </Link>

        {chapter.nextChapter ? (
          <Link
            href={`/read/${chapter.nextChapter.chapterId}`}
            className="btn btn-primary shadow-glow-primary tap-target w-full sm:w-auto flex items-center justify-center gap-1.5 font-bold"
          >
            <span>Next Ch {chapter.nextChapter.chapterNumber}</span>
            <ChevronRight size={16} />
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>
    </nav>
  );
}

