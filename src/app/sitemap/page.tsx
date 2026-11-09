import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Sitemap | The Detailing Monk", description: "All pages of The Detailing Monk website." };

const pages = [...db.site.nav, ...db.site.footerLinks.filter((l) => l.href !== "/sitemap")];

export default function SitemapPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero title="Sitemap" crumbs={[{ label: "Home", href: "/" }]} />
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((p, i) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="flex items-center gap-4">
                  <span className="font-display text-sm font-semibold text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-medium">{p.label}</span>
                </span>
                <svg className="text-primary transition-transform group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
