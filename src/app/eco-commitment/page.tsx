import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { EcoIntro } from "@/components/eco/intro";
import { EcoCommitments } from "@/components/eco/commitments";
import { ServicesCta } from "@/components/services/cta";
import { db } from "@/lib/db";

const { meta, banner, label } = db.eco;

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function EcoCommitmentPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero title={banner.title} eyebrow={label} crumbs={[{ label: "Home", href: "/" }]} />
      <EcoIntro />
      <EcoCommitments />
      <div className="pt-20 sm:pt-24">
        <ServicesCta />
      </div>
    </main>
  );
}
