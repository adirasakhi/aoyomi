export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
}

export interface Format {
  id: string;
  name: string;
}

export interface Type {
  id: string;
  name: string;
}

export interface Manga {
  mangaId: string;
  title: string;
  alternativeTitle?: string | null;
  description?: string | null;
  cover?: string | null;
  coverPortrait?: string | null;
  status?: string | null;
  releaseYear?: string | number | null;
  country?: string | null;
  rating?: number | null;
  views?: number | null;
  bookmarks?: number | null;
  latestChapter?: number | null;
  latestChapterId?: string | null;
  latestChapterTime?: string | null;
  isRecommended?: boolean;
  genres: Genre[];
  authors: Person[];
  artists: Person[];
  format?: string | Format[];
  type?: string | Type[];
}

export interface MangaDetail extends Omit<Manga, "latestChapter"> {
  rank?: number;
  categories?: string[];
  createdAt?: string;
  updatedAt?: string;
  firstChapter?: {
    chapterId: string;
    chapterNumber: number;
    updatedAt?: string;
  };
  latestChapter?: {
    chapterId: string;
    chapterNumber: number;
    updatedAt: string;
  };
  latestChapterNumber?: number | null;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalRecord: number;
  pageSize: number;
}

export interface HomeResponse {
  latest: Manga[];
  recommended: Manga[];
  popular: Manga[];
}

export interface SliderItem {
  id: string;
  title: string;
  rating: number;
  backgroundImage: string;
  charaImage: string;
  mangaId: string;
  blurColor: string;
  category: string;
  description: string;
  badges: Badge[];
}

export interface Badge {
  name: string;
  color: string;
}

export interface SliderResponse {
  data: SliderItem[];
}

export interface SearchResponse {
  query: string;
  pagination: Pagination;
  data: Manga[];
}

export interface DetailResponse {
  data: MangaDetail;
}

export interface Chapter {
  chapterId: string;
  mangaId: string;
  chapterNumber: number;
  chapterTitle?: string | null;
  thumbnail?: string | null;
  views?: number | null;
  releaseDate?: string | null;
}

export interface ChaptersResponse {
  mangaId: string;
  pagination: Pagination;
  data: Chapter[];
}

export interface ChapterNavigation {
  chapterId: string;
  chapterNumber: number;
}

export interface ReaderChapter {
  chapterId: string;
  mangaId: string;
  mangaTitle?: string | null;
  chapterNumber: number;
  chapterTitle?: string | null;
  thumbnail?: string | null;
  views?: number | null;
  releaseDate?: string | null;
  prevChapter?: ChapterNavigation | null;
  nextChapter?: ChapterNavigation | null;
  images: string[];
  totalImages: number;
}

export interface ReaderResponse {
  data: ReaderChapter;
}