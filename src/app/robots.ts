import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${db.site.url}/sitemap.xml` };
}
