import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { GetInTouch } from "@/components/contact/get-in-touch";
import { Enquiry } from "@/components/contact/enquiry";
import { db } from "@/lib/db";

const { meta, banner } = db.contact;

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero title={banner.title} eyebrow={db.site.slogan} crumbs={[{ label: "Home", href: "/" }]} />
      <GetInTouch />
      <Enquiry />
    </main>
  );
}
