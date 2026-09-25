import type { SearchResponse } from "@/types/manga";
import { mockMangas } from "./mangas";

const PAGE_SIZE = 12;

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function mockSearch(query: string, page = 1): Promise<SearchResponse> {
  const q = query.trim().toLowerCase();
  const filtered = q
    ? mockMangas.filter((m) => m.title.toLowerCase().includes(q))
    : [...mockMangas];
  const totalRecord = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRecord / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;

  return delay({
    query,
    pagination: { currentPage, totalPages, totalRecord, pageSize: PAGE_SIZE },
    data: filtered.slice(start, start + PAGE_SIZE),
  });
}
