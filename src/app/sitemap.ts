import type { MetadataRoute } from "next";
import { business } from "@/lib/business";
import { PAGE_META } from "@/lib/seo";
import { services } from "@/lib/services-data";

/* Update this date whenever page content changes, so Google knows to re-crawl. */
const LAST_MODIFIED = "2026-11-18";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = business.siteUrl;
  const staticPages = Object.keys(PAGE_META).map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : path === "/services" ? 0.9 : path === "/sitemap" ? 0.3 : 0.7,
  }));
  const servicePages = services.map((s) => ({
    url: `${base}/${s.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));
  return [...staticPages, ...servicePages];
}
