import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "www.sankavollerei.web.id" },
      { protocol: "https", hostname: "*.shngm.id" },
    ],
    // Allow all local images, query string or not. NOTE: `search` here is
    // compared literally (see match-local-pattern.js in next/dist), so it
    // must be omitted entirely; only `pathname` supports glob patterns.
    localPatterns: [{ pathname: "/**" }],
  },
};

export default nextConfig;
