import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { ContactCta } from "@/components/services/contact-cta";
import { ServiceCard } from "@/components/services/service-card";
import { JsonLd } from "@/components/seo/json-ld";
import { business, whatsappLink } from "@/lib/business";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { formatINR, PRICE_NOTE, serviceBySlug } from "@/lib/services-data";

/*
 * Full page for one service from src/lib/services-data.ts.
 * Each service has its own small route file (src/app/<slug>/page.tsx) so the page is fully prerendered
 * and unknown URLs return a real 404. To add a service: add it to services-data.ts, then copy one of
 * those route files into a folder named after the new slug.
 */

export function serviceMetadata(slug: string): Metadata {
  const service = serviceBySlug(slug);
  if (!service) throw new Error(`Unknown service slug: ${slug}`);
  return buildMetadata({ path: `/${service.slug}`, title: service.metaTitle, description: service.metaDescription });
}

const h2 = "font-display text-3xl font-medium leading-tight text-foreground sm:text-4xl";
const prose = "mt-4 space-y-4 text-base leading-relaxed text-foreground/80";
const wrap = "mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8";

export function ServicePage({ slug }: { slug: string }) {
  const service = serviceBySlug(slug);
  if (!service) notFound();

  const title = `${service.name} in Rohini, Delhi`;
  const related = service.related.flatMap((slug) => serviceBySlug(slug) ?? []);
  const waMessage = `Hi Detailing Monk, I would like to know more about ${service.name} for my car.`;

  return (
    <main className="flex flex-1 flex-col">
      <JsonLd data={serviceSchema(service)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/${service.slug}` },
        ])}
      />
      <JsonLd data={faqSchema(service.faqs)} />

      <PageHero
        title={title}
        crumb={service.navLabel}
        eyebrow={`Starting from ${formatINR(service.priceFrom)}`}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
        ]}
      />

      {/* Intro + hero image */}
      <section className="py-12 sm:py-20">
        <div className={`${wrap} grid items-center gap-10 lg:grid-cols-2 lg:gap-16`}>
          <div>
            <div className="space-y-4 text-lg leading-relaxed text-foreground/85">
              {service.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted">
              Starting from <span className="font-display text-3xl font-semibold text-deep-burgundy">{formatINR(service.priceFrom)}</span>
              <span className="mt-1 block">{PRICE_NOTE}</span>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0f7d70] px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f7d70]"
              >
                Get a quote on WhatsApp
              </a>
              <a
                href={business.phoneHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-deep-burgundy px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy"
              >
                Call {business.phone}
              </a>
            </div>
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-cosmic-latte shadow-[0_30px_60px_-28px_rgba(114,47,55,0.5)]">
            <Image
              src={service.hero.src}
              alt={service.hero.alt}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 38rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* What it is */}
      <section className="bg-surface-muted/40 py-12 sm:py-20" aria-labelledby="what-heading">
        <div className={`${wrap} grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16`}>
          <div>
            <h2 id="what-heading" className={h2}>
              What is {service.name.toLowerCase().replace("(ppf)", "(PPF)")}?
            </h2>
            <div className={prose}>
              {service.what.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3 self-start sm:gap-4">
            {service.images.map((img, i) => (
              <li key={img.src} className={`relative overflow-hidden rounded-2xl bg-cosmic-latte ${i === 0 ? "col-span-2 aspect-16/9" : "aspect-square"}`}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes={i === 0 ? "(min-width: 1024px) 32rem, 100vw" : "(min-width: 1024px) 16rem, 50vw"}
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-20" aria-labelledby="benefits-heading">
        <div className={wrap}>
          <h2 id="benefits-heading" className={h2}>
            Benefits
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {service.benefits.map((b) => (
              <li key={b.title} className="rounded-3xl border border-border/80 bg-surface p-6">
                <h3 className="font-display text-xl font-semibold text-foreground">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">{b.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="bg-surface-muted/40 py-12 sm:py-20" aria-labelledby="process-heading">
        <div className={wrap}>
          <h2 id="process-heading" className={h2}>
            Our process
          </h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {service.process.map((step, i) => (
              <li key={step.title} className="rounded-3xl bg-surface p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-deep-burgundy text-sm font-semibold text-mocha-cream" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Price + why choose us */}
      <section className="py-12 sm:py-20">
        <div className={`${wrap} grid gap-12 lg:grid-cols-2 lg:gap-16`}>
          <div>
            <h2 className={h2}>{service.name} price in Rohini</h2>
            <div className={prose}>
              {service.priceText.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <table className="mt-6 w-full text-left text-sm">
              <caption className="sr-only">{service.name} starting prices</caption>
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Service
                  </th>
                  <th scope="col" className="py-2 text-right font-semibold">
                    Starting from
                  </th>
                </tr>
              </thead>
              <tbody>
                {service.priceRows.map((row) => (
                  <tr key={row.label} className="border-b border-border/60">
                    <th scope="row" className="py-3 pr-4 font-medium text-foreground">
                      {row.label}
                    </th>
                    <td className="whitespace-nowrap py-3 text-right font-display text-xl font-semibold text-deep-burgundy">
                      {formatINR(row.price)}
                      {row.unit && <span className="ml-1 font-sans text-xs font-medium text-muted">{row.unit}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-sm text-muted">{PRICE_NOTE}</p>
          </div>
          <div>
            <h2 className={h2}>Why choose The Detailing Monk</h2>
            <ul className="mt-6 space-y-4">
              {service.whyUs.map((w) => (
                <li key={w} className="flex gap-3 text-base leading-relaxed text-foreground/80">
                  <svg className="mt-1 shrink-0 text-deep-burgundy" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQs (must match the FAQPage schema above) */}
      <section className="bg-surface-muted/40 py-12 sm:py-20" aria-labelledby="faq-heading">
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-6">
          <h2 id="faq-heading" className={h2}>
            {service.name}: common questions
          </h2>
          <div className="mt-8 space-y-3">
            {service.faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-border/80 bg-surface px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-semibold">{f.q}</h3>
                  <svg className="shrink-0 text-deep-burgundy transition-transform group-open:rotate-45" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="py-12 sm:py-20" aria-labelledby="related-heading">
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="related-heading" className={h2}>
              Related services
            </h2>
            <Link href="/services" className="text-sm font-semibold text-deep-burgundy underline decoration-deep-burgundy/40 underline-offset-4 hover:decoration-deep-burgundy">
              See all services
            </Link>
          </div>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <ServiceCard service={r} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactCta
        heading={`Book ${service.name.toLowerCase().replace("(ppf)", "(PPF)")} in Rohini`}
        text="Call, send a WhatsApp message or drop in at the studio. Share your car model and a few photos for a quick quote."
        message={waMessage}
      />
    </main>
  );
}
