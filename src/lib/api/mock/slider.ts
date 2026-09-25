import type { SliderResponse } from "@/types/manga";
import { mockMangas } from "./mangas";

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function mockSlider(_category = "explore-1"): Promise<SliderResponse> {
  void _category;
  return delay({
    data: mockMangas.slice(0, 3).map((m, i) => ({
      id: `slider-${i + 1}`,
      title: m.title,
      rating: m.rating ?? 0,
      backgroundImage: `https://picsum.photos/seed/${m.mangaId}-bg/1600/900`,
      charaImage: m.cover ?? "",
      mangaId: m.mangaId,
      blurColor: "#161B22",
      category: "explore-1",
      description: m.description ?? "",
      badges:
        i === 0
          ? [{ name: "Popular", color: "#D29922" }]
          : i === 1
            ? [{ name: "New", color: "#58A6FF" }]
            : [],
    })),
  });
}
