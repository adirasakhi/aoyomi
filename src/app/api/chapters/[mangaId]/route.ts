import { NextRequest, NextResponse } from "next/server";
import { shinigami } from "@/lib/api/shinigami";
import { mapChapter, mapPagination, pickList, unwrapRoot } from "@/lib/api/map";
import { cleanId, cleanPage } from "@/lib/api/validate";
import { toErrorResponse, warnShape } from "@/lib/api/route-error";
import type { ChaptersResponse } from "@/types/manga";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ mangaId: string }> }
) {
  try {
    const mangaId = cleanId((await ctx.params).mangaId, "Manga ID");
    const page = cleanPage(req.nextUrl.searchParams.get("page"));
    const data = await shinigami<ChaptersResponse>(
      "chapters",
      `/chapters/${encodeURIComponent(mangaId)}?page=${page}`,
      300
    );
    const root = unwrapRoot(data);
    const out: ChaptersResponse = {
      mangaId,
      pagination: mapPagination(root.pagination ?? {}),
      data: pickList(root.data).map(mapChapter),
    };
    warnShape("chapters", root, ["data", "pagination"]);
    return NextResponse.json(out);
  } catch (e) {
    return toErrorResponse(e);
  }
}
