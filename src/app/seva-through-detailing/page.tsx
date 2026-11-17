import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/page-hero";
import { SevaOffers } from "@/components/seva/offers";
import { ServicesCta } from "@/components/services/cta";
import { db } from "@/lib/db";

const { banner } = db.seva;

export const metadata = pageMetadata("/seva-through-detailing");

export default function SevaPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero title={banner.title} crumb={banner.crumb} eyebrow={db.site.ethos} crumbs={[{ label: "Home", href: "/" }]} />
      <SevaOffers />
      <ServicesCta />
    </main>
  );
}
