import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { BrandsIntro } from "@/components/brands/intro";
import { BrandsWall } from "@/components/brands/wall";
import { BrandsInUse } from "@/components/brands/in-use";
import { BrandsNameMarquee } from "@/components/brands/name-marquee";
import { ServicesCta } from "@/components/services/cta";
import { db } from "@/lib/db";

const { meta, banner } = db.brands;

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function BrandsPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero title={banner.title} eyebrow={db.site.tagline} crumbs={[{ label: "Home", href: "/" }]} />
      <BrandsIntro />
      <BrandsWall />
      <BrandsNameMarquee />
      <BrandsInUse />
      <ServicesCta />
    </main>
  );
}
