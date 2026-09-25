import { NextRequest, NextResponse } from "next/server";

// Image proxy: some comic CDNs refuse browser/direct loads (hotlink
// protection). Fetching server-side with a browser UA + site referrer and
// re-serving from our own origin bypasses that. SSRF-guarded: only the
// known comic hosts are allowed, https only, image content only.
const ALLOWED_HOSTS = [
  /(^|\.)shngm\.id$/,
  /(^|\.)sankavollerei\.web\.id$/,
  /(^|\.)sankavollerei\.com$/,
];

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  let target: URL;
  try {
    if (!raw) throw new Error("empty");
    target = new URL(raw);
  } catch {
    return NextResponse.json({ message: "URL tidak valid." }, { status: 400 });
  }
  if (
    target.protocol !== "https:" ||
    !ALLOWED_HOSTS.some((re) => re.test(target.hostname))
  ) {
    return NextResponse.json({ message: "Host tidak diizinkan." }, { status: 400 });
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Referer: "https://g.shinigami.asia/",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      cache: "force-cache",
    });
    const type = upstream.headers.get("content-type") ?? "";
    if (!upstream.ok || !upstream.body || !type.startsWith("image/")) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[img] upstream ${upstream.status} (${type}) for ${target.hostname}`);
      }
      return NextResponse.json({ message: "Gambar gagal dimuat." }, { status: 502 });
    }
    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type": type,
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[img] fetch failed for ${target.hostname}: ${e instanceof Error ? e.message : e}`
      );
    }
    return NextResponse.json({ message: "Gambar gagal dimuat." }, { status: 502 });
  }
}
