import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "www.sankavollerei.web.id" },
      { protocol: "https", hostname: "*.shngm.id" },
    ],
  },
};

export default nextConfig;
