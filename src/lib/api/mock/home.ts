import type { HomeResponse } from "@/types/manga";
import { mockMangas } from "./mangas";

function delay<T>(value: T, ms = 180): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function mockHome(): Promise<HomeResponse> {
  return delay({
    latest: [...mockMangas].sort((a, b) => (b.latestChapter ?? 0) - (a.latestChapter ?? 0)),
    recommended: mockMangas.filter((m) => m.isRecommended),
    popular: [...mockMangas].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)),
  });
}
