// Absolute remote URLs go through our /api/image proxy (anti-hotlink,
// mixed-content, and host-allowlist safe). Local paths, data URIs, and the
// mock provider (picsum) load directly.
const DIRECT_HOSTS = new Set(["picsum.photos"]);

export function proxied(src?: string | null): string | null {
  if (!src) return null;
  if (src.startsWith("/") || src.startsWith("data:")) return src;
  try {
    const u = new URL(src);
    if (DIRECT_HOSTS.has(u.hostname)) return src;
    return `/api/image?url=${encodeURIComponent(src)}`;
  } catch {
    return src;
  }
}
