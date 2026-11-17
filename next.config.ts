import type { NextConfig } from "next";
import { business } from "./src/lib/business";

/* Old static-site URLs (.htm) → new routes. Permanent, so Google transfers the old rankings. */
const LEGACY_REDIRECTS: Record<string, string> = {
  "/index.htm": "/",
  "/about-us.htm": "/about-us",
  "/services.htm": "/services",
  "/our-brand.htm": "/brands",
  "/eco-commitment.htm": "/eco-commitment",
  "/gallery.htm": "/gallery",
  "/contact-us.htm": "/contact-us",
  "/seva-through-detailing.htm": "/seva-through-detailing",
  "/sitemap.htm": "/sitemap",
};

const APEX_HOST = business.host.replace(/^www\./, "");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // absolute destinations: one hop straight to the canonical https://www host, whatever host was requested
      ...Object.entries(LEGACY_REDIRECTS).map(([source, destination]) => ({
        source,
        destination: `${business.siteUrl}${destination}`,
        statusCode: 301 as const,
      })),
      // non-www → www (http → https is done by Vercel automatically)
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: APEX_HOST }],
        destination: `${business.siteUrl}/:path*`,
        statusCode: 301 as const,
      },
    ];
  },
  async headers() {
    return [
      // every host except the live domain (e.g. *.vercel.app previews) is kept out of Google
      {
        source: "/:path*",
        missing: [{ type: "host" as const, value: business.host }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
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
