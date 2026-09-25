import type { MangaRepository } from "./repository";
import { mockHome } from "./mock/home";
import { mockSlider } from "./mock/slider";
import { mockSearch } from "./mock/search";
import { mockDetail } from "./mock/detail";
import { mockChapters } from "./mock/chapters";
import { mockReader } from "./mock/reader";

export class MockMangaRepository implements MangaRepository {
  getHome() {
    return mockHome();
  }
  getSlider(category: string) {
    return mockSlider(category);
  }
  search(query: string, page = 1) {
    return mockSearch(query, page);
  }
  getDetail(mangaId: string) {
    return mockDetail(mangaId);
  }
  getChapters(mangaId: string, page = 1) {
    return mockChapters(mangaId, page);
  }
  getChapter(chapterId: string) {
    return mockReader(chapterId);
  }
}
