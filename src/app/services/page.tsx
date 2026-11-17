import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/page-hero";
import { ServicesIntro } from "@/components/services/intro";
import { ServicesProcesses } from "@/components/services/processes";
import { ServicesCatalogue } from "@/components/services/catalogue";
import { ServicesCta } from "@/components/services/cta";
import { ServiceCards } from "@/components/services/service-cards";
import { db } from "@/lib/db";

const { banner } = db.services;

export const metadata = pageMetadata("/services");

export default function ServicesPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero title={banner.title} crumb={banner.crumb} eyebrow={db.site.ethos} crumbs={[{ label: "Home", href: "/" }]} />
      <ServicesIntro />
      <ServiceCards />
      <ServicesProcesses />
      <ServicesCatalogue />
      <ServicesCta />
    </main>
  );
}
