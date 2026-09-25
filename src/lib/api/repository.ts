import type {
  HomeResponse,
  SliderResponse,
  SearchResponse,
  DetailResponse,
  ChaptersResponse,
  ReaderResponse,
} from "@/types/manga";

export interface MangaRepository {
  getHome(): Promise<HomeResponse>;
  getSlider(category: string): Promise<SliderResponse>;
  search(query: string, page?: number): Promise<SearchResponse>;
  getDetail(mangaId: string): Promise<DetailResponse>;
  getChapters(mangaId: string, page?: number): Promise<ChaptersResponse>;
  getChapter(chapterId: string): Promise<ReaderResponse>;
}

export type DataProvider = "mock" | "api";

export interface RepositoryConfig {
  provider: DataProvider;
  baseUrl?: string;
}