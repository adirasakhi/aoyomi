import "server-only";
import { HttpError, assertObjectBody } from "./validate";
import { shinigamiBucket, recordRequest } from "./rate-limiter";

const BASE_URL =
  process.env.SHINIGAMI_BASE_URL ??
  "https://www.sankavollerei.web.id/comic/shinigami";

// Server-only fetcher. Every external request passes the rate limiter,
// gets validated upstream, counted, and cached per endpoint priority.
export async function shinigami<T>(
  endpoint: string,
  path: string,
  revalidateSeconds: number
): Promise<T> {
  await shinigamiBucket.acquire();
  recordRequest(endpoint);
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: revalidateSeconds },
  });
  if (res.status === 429) {
    throw new HttpError(
      429,
      "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi."
    );
  }
  if (res.status === 404) throw new HttpError(404, "Data tidak ditemukan.");
  if (!res.ok) {
    throw new HttpError(502, "Gagal mengambil data. Silakan coba lagi nanti.");
  }
  const body: unknown = await res.json();
  assertObjectBody(body);
  return body as T;
}
