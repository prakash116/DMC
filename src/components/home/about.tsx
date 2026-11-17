"use client";

import Image from "next/image";
import Link from "next/link";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { db } from "@/lib/db";

const { about } = db.home;
const { tagline } = db.site;
const EASE = [0.22, 1, 0.36, 1] as const;

export function About() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-14 sm:py-24 lg:py-28" aria-labelledby="about-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Copy */}
        <m.div
          className="text-center lg:text-left"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
        >
          <m.p variants={fade(reduce)} className="font-display text-lg italic text-deep-burgundy">
            {about.label}
          </m.p>
          <m.h2
            id="about-heading"
            variants={fade(reduce)}
            className="mt-2 font-display text-4xl font-medium leading-[1.08] text-foreground sm:text-5xl lg:text-[3.4rem]"
          >
            {about.heading}
          </m.h2>

          {about.paragraphs.map((p) => (
            <m.p key={p.slice(0, 24)} variants={fade(reduce)} className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base lg:mx-0">
              {p}
            </m.p>
          ))}

          {/* Value Badges */}
          <m.div variants={fade(reduce)} className="mx-auto mt-8 grid max-w-lg grid-cols-2 gap-3 lg:mx-0">
            {about.usps.map((usp) => (
              <div
                key={usp}
                className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-surface/80 px-3.5 py-2.5 text-xs font-semibold text-foreground shadow-xs sm:text-[13px]"
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-deep-burgundy/15 text-deep-burgundy">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{usp}</span>
              </div>
            ))}
          </m.div>

          <m.div variants={fade(reduce)} className="mt-9 flex flex-wrap items-center justify-center gap-5 lg:justify-start">
            <Link
              href={about.cta.href}
              className="inline-flex items-center gap-2 rounded-full bg-deep-burgundy px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_var(--deep-burgundy)] transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy"
            >
              {about.cta.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <span className="flex items-center gap-3 text-sm font-medium text-muted">
              <span className="flex -space-x-2" aria-hidden="true">
                <span className="h-8 w-8 rounded-full border-2 border-background bg-deep-burgundy" />
                <span className="h-8 w-8 rounded-full border-2 border-background bg-cosmic-latte" />
                <span className="h-8 w-8 rounded-full border-2 border-background bg-mocha-cream" />
              </span>
              {tagline}
            </span>
          </m.div>
        </m.div>

        {/* Photo: bleeds to the right edge on desktop, floating info card over its corner */}
        <m.div
          className="relative"
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(114,47,55,0.45)] sm:aspect-square lg:aspect-auto lg:h-150 lg:rounded-[2.5rem]">
            <Image
              src={about.image}
              alt="Foam wash, machine polishing and interior care at The Detailing Monk"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            {/* burgundy tint toward the bottom so the card sits comfortably */}
            <div className="absolute inset-0 bg-linear-to-t from-deep-burgundy/35 via-transparent to-transparent" aria-hidden="true" />
          </div>

          <m.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            className="glass-strong relative mx-auto -mt-12 w-[min(300px,calc(100%-2.5rem))] rounded-2xl p-5 lg:absolute lg:-left-8 lg:bottom-14 lg:mx-0 lg:mt-0"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-display text-3xl font-semibold leading-none text-foreground sm:text-4xl">{about.card.big}</span>
              <span className="rounded-full bg-deep-burgundy px-2.5 py-1 text-[11px] font-semibold text-mocha-cream">{about.card.pill}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-muted">{about.card.sub}</p>
            <p className="mt-4 flex items-center gap-2 border-t border-border/70 pt-3 text-sm font-medium text-foreground">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="text-deep-burgundy" aria-hidden="true">
                <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {about.card.line}
            </p>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}

function fade(reduce: boolean | null): Variants {
  return {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  };
}
