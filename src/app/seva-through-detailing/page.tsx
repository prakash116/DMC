import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { SevaOffers } from "@/components/seva/offers";
import { ServicesCta } from "@/components/services/cta";
import { db } from "@/lib/db";

const { meta, banner } = db.seva;

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function SevaPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero title={banner.title} eyebrow={db.site.ethos} crumbs={[{ label: "Home", href: "/" }]} />
      <SevaOffers />
      <ServicesCta />
    </main>
  );
}
