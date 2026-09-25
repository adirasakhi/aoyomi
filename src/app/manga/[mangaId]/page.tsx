import type { Metadata } from "next";
import { MangaDetailView } from "./MangaDetailClient";
import { getRepository } from "@/lib/api/factory";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mangaId: string }>;
}): Promise<Metadata> {
  const { mangaId } = await params;
  try {
    const { data } = await getRepository().getDetail(mangaId);
    const title = `${data.title} - Chapter List`;
    const description =
      data.description ?? `Baca ${data.title} dan lihat daftar chapter terbaru.`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        ...(data.cover ? { images: [{ url: data.cover }] } : {}),
      },
    };
  } catch {
    return { title: "Manga tidak ditemukan" };
  }
}

export default async function MangaDetailPage({
  params,
}: {
  params: Promise<{ mangaId: string }>;
}) {
  const { mangaId } = await params;
  return <MangaDetailView mangaId={mangaId} />;
}
