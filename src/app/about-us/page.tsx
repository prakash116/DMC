import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/page-hero";
import { AboutIntro } from "@/components/about/intro";
import { Philosophy } from "@/components/about/philosophy";
import { ExploreBook } from "@/components/about/book";
import { Founder } from "@/components/about/founder";
import { db } from "@/lib/db";

const { banner } = db.about;

export const metadata = pageMetadata("/about-us");

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        title={banner.title}
        crumb={banner.crumb}
        eyebrow={banner.eyebrow}
        text={banner.text}
        crumbs={[{ label: "Home", href: "/" }]}
      />
      <AboutIntro />
      <Philosophy />
      <ExploreBook />
      <Founder />
    </main>
  );
}
