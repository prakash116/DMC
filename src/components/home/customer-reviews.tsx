"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { db } from "@/lib/db";
import { business, googleRatingLabel } from "@/lib/business";
import { testimonials } from "@/lib/testimonials";

const { reviews } = db.home;

/* Real Google reviews only (src/lib/testimonials.ts); rating and count come from the business config */
export function CustomerReviews() {
  const reduce = useReducedMotion();

  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id="customer-reviews" className="relative overflow-hidden bg-surface-muted/40 py-14 sm:py-24 lg:py-28" aria-labelledby="reviews-heading">
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
          {/* Google rating badge */}
          <a
            href={business.googleProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy"
          >
            {googleRatingLabel}
          </a>

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
          {testimonials.map((r) => (
            <m.li key={r.name} variants={item}>
              <a
                href={r.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${r.name}'s ${r.rating}-star review on Google`}
                className="flex h-full flex-col justify-between rounded-3xl border border-border/80 bg-surface p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-deep-burgundy/40 hover:shadow-[0_20px_40px_-20px_rgba(114,47,55,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy sm:p-7"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex text-sm tracking-wider text-amber-500" aria-hidden="true">
                      {"★".repeat(r.rating)}
                    </div>
                    <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-foreground/70">Google review</span>
                  </div>

                  {r.service && (
                    <span className="mt-4 inline-block rounded-lg bg-deep-burgundy/10 px-2 py-0.5 text-[11px] font-semibold text-deep-burgundy">
                      {r.service}
                    </span>
                  )}

                  <p className="mt-4 text-sm italic leading-relaxed text-foreground/80">&ldquo;{r.text}&rdquo;</p>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-deep-burgundy text-xs font-semibold text-mocha-cream" aria-hidden="true">
                    {r.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{r.name}</p>
                    <p className="truncate text-xs text-muted">{r.date ? `Reviewed ${r.date}` : "Read on Google"}</p>
                  </div>
                </div>
              </a>
            </m.li>
          ))}
        </m.ul>

        {/* Read / write Google reviews */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <a
            href={business.googleProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-deep-burgundy underline decoration-deep-burgundy/40 underline-offset-4 hover:decoration-deep-burgundy"
          >
            Read our Google reviews
          </a>
          <a
            href={business.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-deep-burgundy px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_-8px_var(--deep-burgundy)] transition-all hover:-translate-y-0.5 hover:bg-[#582229] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy"
          >
            Write a review
          </a>
        </div>
      </div>
    </section>
  );
}
