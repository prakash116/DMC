import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  productionBrowserSourceMaps: true,
  partialPrefetching: true,
  images: {
    // AVIF first (smaller on phones), WebP for browsers without AVIF support
    formats: ["image/avif", "image/webp"],
    // optimized images are immutable per URL; cache them for 30 days instead of revalidating every 4 hours
    minimumCacheTTL: 2592000,
  },
};

export default nextConfig;
