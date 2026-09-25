import { NextResponse } from "next/server";
import { shinigami } from "@/lib/api/shinigami";
import { mapMangaDetail, unwrapRoot } from "@/lib/api/map";
import { cleanId } from "@/lib/api/validate";
import { toErrorResponse } from "@/lib/api/route-error";
import type { DetailResponse } from "@/types/manga";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ mangaId: string }> }
) {
  try {
    const mangaId = cleanId((await ctx.params).mangaId, "Manga ID");
    const data = await shinigami<DetailResponse>(
      "detail",
      `/detail/${encodeURIComponent(mangaId)}`,
      600
    );
    const root = unwrapRoot(data);
    const payload = root.data && typeof root.data === "object" ? root.data : root;
    const out: DetailResponse = { data: mapMangaDetail(payload) };
    return NextResponse.json(out);
  } catch (e) {
    return toErrorResponse(e);
  }
}
