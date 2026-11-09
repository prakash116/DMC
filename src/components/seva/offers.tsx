"use client";

import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { db } from "@/lib/db";
import { fade, EASE } from "@/components/services/motion";

const seva = db.seva;
const { contact } = db.site;
const wa = (offer: string) => `${contact.whatsappHref}?text=${encodeURIComponent(`Hi, I'd like to book the ${offer} offer (Seva Through Detailing).`)}`;

export function SevaOffers() {
  const reduce = useReducedMotion();
  return (
    <section className="py-20 sm:py-24 lg:py-28" aria-labelledby="seva-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20 lg:px-8">
        <div>
          <m.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
            <m.p variants={fade(reduce)} className="font-display text-lg italic text-primary">
              {seva.label}
            </m.p>
            <m.h2 id="seva-heading" variants={fade(reduce)} className="mt-2 font-display text-4xl font-medium leading-[1.08] sm:text-5xl">
              {seva.heading}
            </m.h2>
            <m.p variants={fade(reduce)} className="mt-4 font-display text-2xl italic text-foreground/80">
              {seva.subheading}
            </m.p>
          </m.div>

          {/* coupon-style offer cards */}
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {seva.offers.map((o, i) => (
              <m.li
                key={o.title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, rotate: i ? 2 : -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, ease: EASE, delay: reduce ? 0 : i * 0.12 }}
              >
                <a
                  href={wa(o.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-[#2b1d1f] text-mocha-cream shadow-[0_30px_60px_-30px_rgba(114,47,55,0.6)] transition-transform duration-500 hover:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full skew-x-[-18deg] bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-[520%]" />
                  <div className="p-6 sm:p-7">
                    <p className="text-xs font-semibold tracking-[0.16em] text-[#e9a970] uppercase">{o.title}</p>
                    <p className="mt-3 font-display text-6xl font-semibold leading-none sm:text-7xl">{o.discount}</p>
                    <p className="mt-3 text-sm text-mocha-cream/80">{o.on}</p>
                  </div>
                  {/* perforation */}
                  <div className="relative mx-6 border-t border-dashed border-mocha-cream/25" aria-hidden="true">
                    <span className="absolute -left-9 -top-3 h-6 w-6 rounded-full bg-background" />
                    <span className="absolute -right-9 -top-3 h-6 w-6 rounded-full bg-background" />
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 p-6 pt-5 sm:px-7">
                    <p className="text-sm font-medium">{o.when}</p>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mocha-cream text-[#2b1d1f] transition-transform duration-500 group-hover:rotate-[-45deg]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </a>
              </m.li>
            ))}
          </ul>
          <p className="mt-6 text-sm italic text-foreground/70">{seva.footnote}</p>
        </div>

        {/* original offer artwork */}
        <m.div
          className="relative mx-auto w-full max-w-md lg:max-w-none"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="absolute -right-3 -top-3 h-full w-full rounded-3xl border border-primary/25 sm:-right-5 sm:-top-5" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(114,47,55,0.5)]">
            <Image src={seva.image} alt={seva.heading} width={1536} height={1024} sizes="(min-width: 1024px) 40vw, 90vw" className="h-auto w-full" />
          </div>
        </m.div>
      </div>
    </section>
  );
}
