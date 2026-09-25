import type { Metadata } from "next";
import { ReaderView } from "./ReaderClient";
import { getRepository } from "@/lib/api/factory";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}): Promise<Metadata> {
  const { chapterId } = await params;
  try {
    const { data } = await getRepository().getChapter(chapterId);
    let mangaTitle = data.mangaId;
    try {
      const detail = await getRepository().getDetail(data.mangaId);
      mangaTitle = detail.data.title;
    } catch {
      // Judul manga opsional; chapter tetap valid tanpa itu.
    }
    const title = `${mangaTitle} - Chapter ${data.chapterNumber}`;
    const description = `Baca ${mangaTitle} chapter ${data.chapterNumber} (${data.totalImages} halaman).`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        ...(data.thumbnail ? { images: [{ url: data.thumbnail }] } : {}),
      },
    };
  } catch {
    return { title: "Chapter tidak ditemukan" };
  }
}

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  return <ReaderView key={chapterId} chapterId={chapterId} />;
}
