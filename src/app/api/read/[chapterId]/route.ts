import { NextResponse } from "next/server";
import { shinigami } from "@/lib/api/shinigami";
import { mapReaderChapter, unwrapRoot } from "@/lib/api/map";
import { cleanId } from "@/lib/api/validate";
import { toErrorResponse } from "@/lib/api/route-error";
import type { ReaderResponse } from "@/types/manga";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ chapterId: string }> }
) {
  try {
    const chapterId = cleanId((await ctx.params).chapterId, "Chapter ID");
    const data = await shinigami<ReaderResponse>(
      "read",
      `/read/${encodeURIComponent(chapterId)}`,
      120
    );
    const root = unwrapRoot(data);
    const payload = root.data && typeof root.data === "object" ? root.data : root;
    const out: ReaderResponse = { data: mapReaderChapter(payload) };
    return NextResponse.json(out);
  } catch (e) {
    return toErrorResponse(e);
  }
}
