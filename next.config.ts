import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  productionBrowserSourceMaps: true,
  partialPrefetching: true,
};

export default nextConfig;
