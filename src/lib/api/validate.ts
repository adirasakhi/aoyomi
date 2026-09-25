export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
  }
}

// IDs from the API (manga_id, chapter_id, category): non-empty, bounded,
// no path tricks. Throws HttpError(400) when invalid.
export function cleanId(value: string | null | undefined, name: string): string {
  const v = (value ?? "").trim();
  if (!v || v.length > 160 || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(v)) {
    throw new HttpError(400, `${name} tidak valid.`);
  }
  return v;
}

export function cleanQuery(value: string | null | undefined): string {
  const v = (value ?? "").trim();
  if (!v || v.length > 100) throw new HttpError(400, "Kata kunci tidak valid.");
  return v;
}

export function cleanPage(value: string | null | undefined): number {
  const n = Number(value ?? "1");
  if (!Number.isInteger(n) || n < 1 || n > 500) {
    throw new HttpError(400, "Halaman tidak valid.");
  }
  return n;
}

// The real API occasionally answers 200 with an empty body. Reject it here
// so the UI shows ErrorState + retry instead of crashing on null.
export function assertObjectBody(body: unknown): asserts body is Record<string, unknown> {
  if (!body || typeof body !== "object") {
    throw new HttpError(502, "Gagal mengambil data. Silakan coba lagi nanti.");
  }
}
