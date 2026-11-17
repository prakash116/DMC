import { ServiceCard } from "./service-card";
import { PRICE_NOTE, services } from "@/lib/services-data";

/* Grid of all service pages with starting prices (used on /services) */
export function ServiceCards() {
  return (
    <section id="service-prices" className="scroll-mt-28 bg-surface-muted/40 py-14 sm:py-24" aria-labelledby="service-prices-heading">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-display text-lg italic text-primary">Services &amp; prices</p>
          <h2 id="service-prices-heading" className="mt-2 font-display text-4xl font-medium leading-[1.08] text-foreground sm:text-5xl">
            Popular services and starting prices
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/70">
            Open any service to see what it includes, how we do it and answers to common questions. {PRICE_NOTE}
          </p>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug}>
              <ServiceCard service={s} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
