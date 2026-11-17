import type { MetadataRoute } from "next";
import { business } from "@/lib/business";

/*
 * Production: allow everything and point to the sitemap on the live domain.
 * Vercel preview deployments (VERCEL_ENV=preview): disallow everything.
 * The production build is also reachable on *.vercel.app; those hosts get an
 * "X-Robots-Tag: noindex" header from next.config.ts, so only the live domain is indexed.
 */
export default function robots(): MetadataRoute.Robots {
  const isPreview = process.env.VERCEL_ENV !== undefined && process.env.VERCEL_ENV !== "production";
  if (isPreview) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${business.siteUrl}/sitemap.xml`,
    host: business.siteUrl,
  };
}
