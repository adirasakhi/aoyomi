import Link from "next/link";
import type { ReaderChapter } from "@/types/manga";

export function ReaderNav({ chapter, mangaId }: { chapter: ReaderChapter; mangaId: string }) {
  return (
    <nav aria-label="Navigasi chapter" className="flex gap-2 justify-between mt-8">
      {chapter.prevChapter ? (
        <Link href={`/read/${chapter.prevChapter.chapterId}`} className="btn btn-secondary tap-target">
          Prev Ch {chapter.prevChapter.chapterNumber}
        </Link>
      ) : (
        <span />
      )}
      <Link href={`/manga/${mangaId}`} className="btn btn-ghost tap-target">
        Daftar chapter
      </Link>
      {chapter.nextChapter ? (
        <Link href={`/read/${chapter.nextChapter.chapterId}`} className="btn btn-primary tap-target">
          Next Ch {chapter.nextChapter.chapterNumber}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
