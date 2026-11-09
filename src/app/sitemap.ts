import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = db.site.url;
  const paths = [...db.site.nav.map((n) => n.href), ...db.site.footerLinks.map((l) => l.href)];
  return Array.from(new Set(paths)).map((p) => ({ url: `${base}${p === "/" ? "" : p}`, changeFrequency: "monthly", priority: p === "/" ? 1 : 0.7 }));
}
