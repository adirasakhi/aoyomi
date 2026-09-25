import type { MangaRepository } from "./repository";
import { MockMangaRepository } from "./mock-repository";
import { ShinigamiApiRepository } from "./api-repository";

let repo: MangaRepository | null = null;

// Default is mock. API activates only when explicitly enabled.
export function getRepository(): MangaRepository {
  if (!repo) {
    const useApi = process.env.NEXT_PUBLIC_USE_REAL_API === "1";
    repo = useApi ? new ShinigamiApiRepository() : new MockMangaRepository();
  }
  return repo;
}
