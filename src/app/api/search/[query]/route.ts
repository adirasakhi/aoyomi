import { NextRequest, NextResponse } from "next/server";
import { shinigami } from "@/lib/api/shinigami";
import { mapManga, mapPagination, pickList, unwrapRoot } from "@/lib/api/map";
import { cleanQuery, cleanPage } from "@/lib/api/validate";
import { toErrorResponse, warnShape } from "@/lib/api/route-error";
import type { SearchResponse } from "@/types/manga";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ query: string }> }
) {
  try {
    const q = cleanQuery(decodeURIComponent((await ctx.params).query));
    const page = cleanPage(req.nextUrl.searchParams.get("page"));
    const data = await shinigami<SearchResponse>(
      "search",
      `/search/${encodeURIComponent(q)}?page=${page}`,
      120
    );
    const root = unwrapRoot(data);
    const out: SearchResponse = {
      query: typeof root.query === "string" ? root.query : q,
      pagination: mapPagination(root.pagination ?? {}),
      data: pickList(root.data).map(mapManga),
    };
    warnShape("search", root, ["data", "pagination"]);
    return NextResponse.json(out);
  } catch (e) {
    return toErrorResponse(e);
  }
}
