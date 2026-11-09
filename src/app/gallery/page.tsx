import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Gallery } from "@/components/gallery/gallery";
import { ServicesCta } from "@/components/services/cta";
import { db } from "@/lib/db";

const { meta, banner } = db.gallery;

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function GalleryPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero title={banner.title} eyebrow={db.site.slogan} crumbs={[{ label: "Home", href: "/" }]} />
      <Gallery />
      <div className="pt-20 sm:pt-24">
        <ServicesCta />
      </div>
    </main>
  );
}
