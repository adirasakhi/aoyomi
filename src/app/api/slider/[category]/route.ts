import { NextResponse } from "next/server";
import { shinigami } from "@/lib/api/shinigami";
import { mapSliderItem, pickList, unwrapRoot } from "@/lib/api/map";
import { cleanId } from "@/lib/api/validate";
import { toErrorResponse, warnShape } from "@/lib/api/route-error";
import type { SliderResponse } from "@/types/manga";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ category: string }> }
) {
  try {
    const category = cleanId((await ctx.params).category, "Kategori");
    const data = await shinigami<SliderResponse>(
      "slider",
      `/slider/${encodeURIComponent(category)}`,
      600
    );
    const root = unwrapRoot(data);
    const out: SliderResponse = { data: pickList(root.data).map(mapSliderItem) };
    warnShape("slider", root, ["data"]);
    return NextResponse.json(out);
  } catch (e) {
    return toErrorResponse(e);
  }
}
