import { useQuery } from "@tanstack/react-query";
import { getRepository } from "@/lib/api/factory";

const repo = () => getRepository();

export function useHome() {
  return useQuery({
    queryKey: ["home"],
    queryFn: () => repo().getHome(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useSlider(category = "explore-1") {
  return useQuery({
    queryKey: ["slider", category],
    queryFn: () => repo().getSlider(category),
    staleTime: 10 * 60 * 1000,
  });
}

export function useSearch(query: string, page = 1) {
  return useQuery({
    queryKey: ["search", query, page],
    queryFn: () => repo().search(query, page),
    enabled: query.trim().length > 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useMangaDetail(mangaId: string) {
  return useQuery({
    queryKey: ["manga", mangaId],
    queryFn: () => repo().getDetail(mangaId),
    enabled: mangaId.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}

export function useChapters(mangaId: string, page = 1) {
  return useQuery({
    queryKey: ["chapters", mangaId, page],
    queryFn: () => repo().getChapters(mangaId, page),
    enabled: mangaId.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useReader(chapterId: string) {
  return useQuery({
    queryKey: ["reader", chapterId],
    queryFn: () => repo().getChapter(chapterId),
    enabled: chapterId.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
