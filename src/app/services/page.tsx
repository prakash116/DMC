import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ServicesIntro } from "@/components/services/intro";
import { ServicesProcesses } from "@/components/services/processes";
import { ServicesCatalogue } from "@/components/services/catalogue";
import { ServicesCta } from "@/components/services/cta";
import { db } from "@/lib/db";

const { meta, banner } = db.services;

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function ServicesPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero title={banner.title} eyebrow={db.site.ethos} crumbs={[{ label: "Home", href: "/" }]} />
      <ServicesIntro />
      <ServicesProcesses />
      <ServicesCatalogue />
      <ServicesCta />
    </main>
  );
}
