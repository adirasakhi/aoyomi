import { NextResponse } from "next/server";
import { HttpError } from "./validate";

// Consistent proxy error shape. In dev, include the upstream status and
// message so integration issues are diagnosable; in production only the
// user-facing message is exposed.
export function toErrorResponse(e: unknown) {
  const status = e instanceof HttpError ? e.status : 500;
  const message =
    e instanceof HttpError ? e.message : "Gagal mengambil data.";
  const body: Record<string, unknown> = { message };
  if (process.env.NODE_ENV !== "production") {
    body.upstreamStatus = status;
    if (e instanceof Error && !(e instanceof HttpError)) body.detail = e.message;
  }
  return NextResponse.json(body, { status });
}

// Dev-only shape diagnostic: logs upstream top-level keys and any expected
// keys that came back missing (read from the dev server terminal).
export function warnShape(endpoint: string, body: unknown, expected: string[]) {
  if (process.env.NODE_ENV === "production") return;
  const keys =
    body && typeof body === "object" ? Object.keys(body as Record<string, unknown>) : [];
  const missing = expected.filter((k) => !(keys.includes(k)));
  if (missing.length > 0) {
    console.warn(`[proxy:${endpoint}] keys=[${keys.join(",")}] missing=[${missing.join(",")}]`);
  }
}
