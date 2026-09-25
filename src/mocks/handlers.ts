import { http, HttpResponse } from "msw";
import { mockMangas } from "@/lib/api/mock/mangas";
import { mockSlider } from "@/lib/api/mock/slider";
import { mockSearch } from "@/lib/api/mock/search";
import { mockDetail } from "@/lib/api/mock/detail";
import { mockChapters } from "@/lib/api/mock/chapters";
import { mockReader } from "@/lib/api/mock/reader";

const BASE = "https://www.sankavollerei.web.id/comic/shinigami";

export const handlers = [
  http.get(`${BASE}/home`, async () => {
    const latest = [...mockMangas];
    return HttpResponse.json({
      latest,
      recommended: mockMangas.filter((m) => m.isRecommended),
      popular: [...mockMangas],
    });
  }),
  http.get(`${BASE}/slider/:category`, async ({ params }) => {
    const data = await mockSlider(String(params.category));
    return HttpResponse.json(data);
  }),
  http.get(`${BASE}/search/:query`, async ({ params, request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const data = await mockSearch(String(params.query), page);
    return HttpResponse.json(data);
  }),
  http.get(`${BASE}/detail/:mangaId`, async ({ params }) => {
    try {
      const data = await mockDetail(String(params.mangaId));
      return HttpResponse.json(data);
    } catch {
      return HttpResponse.json({ message: "Manga tidak ditemukan." }, { status: 404 });
    }
  }),
  http.get(`${BASE}/chapters/:mangaId`, async ({ params, request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    try {
      const data = await mockChapters(String(params.mangaId), page);
      return HttpResponse.json(data);
    } catch {
      return HttpResponse.json({ message: "Manga tidak ditemukan." }, { status: 404 });
    }
  }),
  http.get(`${BASE}/read/:chapterId`, async ({ params }) => {
    try {
      const data = await mockReader(String(params.chapterId));
      return HttpResponse.json(data);
    } catch {
      return HttpResponse.json({ message: "Chapter tidak ditemukan." }, { status: 404 });
    }
  }),
];
