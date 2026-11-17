import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/page-hero";
import { Gallery } from "@/components/gallery/gallery";
import { ServicesCta } from "@/components/services/cta";
import { db } from "@/lib/db";

const { banner } = db.gallery;

export const metadata = pageMetadata("/gallery");

export default function GalleryPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero title={banner.title} crumb={banner.crumb} eyebrow={db.site.slogan} crumbs={[{ label: "Home", href: "/" }]} />
      <Gallery />
      <div className="pt-20 sm:pt-24">
        <ServicesCta />
      </div>
    </main>
  );
}
