import type {
  ChaptersResponse,
  DetailResponse,
  HomeResponse,
  ReaderResponse,
  SearchResponse,
  SliderResponse,
} from "@/types/manga";
import type { MangaRepository } from "./repository";

// All traffic goes through internal /api proxy routes (PRD #29): one place
// for rate limiting, validation, caching, and request counting. The browser
// never talks to the external API directly.
function apiBase(): string {
  if (typeof window !== "undefined") return "";
  return (
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  );
}

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${apiBase()}/api${path}`);
  if (res.status === 429) {
    throw new Error("Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.");
  }
  if (res.status === 404) throw new Error("Data tidak ditemukan.");
  if (res.status === 400) throw new Error("Permintaan tidak valid.");
  if (!res.ok) throw new Error("Gagal mengambil data. Silakan coba lagi nanti.");
  return res.json() as Promise<T>;
}

// Production only. Never used during MVP development (PRD Decision 01).
export class ShinigamiApiRepository implements MangaRepository {
  getHome(): Promise<HomeResponse> {
    return request<HomeResponse>("/home");
  }
  getSlider(category: string): Promise<SliderResponse> {
    return request<SliderResponse>(`/slider/${encodeURIComponent(category)}`);
  }
  search(query: string, page = 1): Promise<SearchResponse> {
    return request<SearchResponse>(
      `/search/${encodeURIComponent(query)}?page=${page}`
    );
  }
  getDetail(mangaId: string): Promise<DetailResponse> {
    return request<DetailResponse>(`/detail/${encodeURIComponent(mangaId)}`);
  }
  getChapters(mangaId: string, page = 1): Promise<ChaptersResponse> {
    return request<ChaptersResponse>(
      `/chapters/${encodeURIComponent(mangaId)}?page=${page}`
    );
  }
  getChapter(chapterId: string): Promise<ReaderResponse> {
    return request<ReaderResponse>(`/read/${encodeURIComponent(chapterId)}`);
  }
}
