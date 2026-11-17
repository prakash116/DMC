import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/page-hero";
import { GetInTouch } from "@/components/contact/get-in-touch";
import { Enquiry } from "@/components/contact/enquiry";
import { db } from "@/lib/db";

const { banner } = db.contact;

export const metadata = pageMetadata("/contact-us");

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero title={banner.title} crumb={banner.crumb} eyebrow={db.site.slogan} crumbs={[{ label: "Home", href: "/" }]} />
      <GetInTouch />
      <Enquiry />
    </main>
  );
}
