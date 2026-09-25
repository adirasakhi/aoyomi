import { NextResponse } from "next/server";
import { shinigami } from "@/lib/api/shinigami";
import { mapManga, pickList, unwrapRoot } from "@/lib/api/map";
import { toErrorResponse, warnShape } from "@/lib/api/route-error";
import type { HomeResponse } from "@/types/manga";

export async function GET() {
  try {
    const data = await shinigami<HomeResponse>("home", "/home", 600);
    const root = unwrapRoot(data);
    const out: HomeResponse = {
      latest: pickList(root.latest).map(mapManga),
      recommended: pickList(root.recommended).map(mapManga),
      popular: pickList(root.popular).map(mapManga),
    };
    warnShape("home", root, ["latest", "recommended", "popular"]);
    return NextResponse.json(out);
  } catch (e) {
    return toErrorResponse(e);
  }
}
