"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { db } from "@/lib/db";

const { reviews } = db.home;

export function CustomerReviews() {
  const reduce = useReducedMotion();

  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id="customer-reviews" className="relative overflow-hidden bg-surface-muted/40 py-20 sm:py-24 lg:py-28" aria-labelledby="reviews-heading">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-deep-burgundy/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <m.div
          className="mx-auto max-w-2xl text-center"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Trust rating badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200">
            <span className="flex text-amber-500">★★★★★</span>
            <span>4.9 / 5 Rating on Google Reviews · 150+ Reviews</span>
          </div>

          <h2 id="reviews-heading" className="mt-4 font-display text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            {reviews.heading}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
            {reviews.subheading}
          </p>
        </m.div>

        <m.ul
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          {reviews.items.map((r) => (
            <m.li
              key={r.name + r.car}
              variants={item}
              className="flex flex-col justify-between rounded-3xl border border-border/80 bg-surface p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-deep-burgundy/40 hover:shadow-[0_20px_40px_-20px_rgba(114,47,55,0.35)] sm:p-7"
            >
              <div>
                {/* Rating stars & verified chip */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500 text-sm tracking-wider" aria-label={`${r.stars} stars`}>
                    {"★".repeat(r.stars)}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Verified Customer
                  </span>
                </div>

                {/* Service Tag & Car badge */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="rounded-lg bg-deep-burgundy/10 px-2 py-0.5 text-[11px] font-semibold text-deep-burgundy">
                    {r.service}
                  </span>
                  <span className="rounded-lg bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-foreground/80">
                    {r.car}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-foreground/80 italic">
                  &ldquo;{r.text}&rdquo;
                </p>
              </div>

              {/* Author footer */}
              <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-deep-burgundy text-xs font-semibold text-mocha-cream">
                  {r.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{r.name}</p>
                  <p className="text-xs text-muted truncate">{r.location}</p>
                </div>
              </div>
            </m.li>
          ))}
        </m.ul>

        {/* Bottom Social Proof Bar */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted">
            Want to see more car transformations? Follow our daily rituals on{" "}
            <a
              href={db.site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-deep-burgundy underline decoration-deep-burgundy/40 underline-offset-4 hover:decoration-deep-burgundy"
            >
              Instagram @thedetailingmonk
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
