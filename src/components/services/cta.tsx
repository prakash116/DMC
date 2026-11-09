"use client";

import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import { db } from "@/lib/db";
import { fade } from "./motion";

const { cta } = db.services;
const { contact, ethos } = db.site;

export function ServicesCta() {
  const reduce = useReducedMotion();
  return (
    <section className="px-3 pb-20 sm:px-4 sm:pb-24 lg:px-6" aria-labelledby="services-cta-heading">
      <m.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-deep-burgundy px-6 py-16 text-center text-mocha-cream sm:px-12 sm:py-20"
      >
        {/* polish sheen sweeping across the band */}
        <span aria-hidden="true" className="sheen-sweep pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-linear-to-r from-transparent via-white/12 to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-mocha-cream/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-mocha-cream/10" />

        <m.p variants={fade(reduce)} className="relative font-display text-lg italic text-[#e9a970]">
          {ethos}
        </m.p>
        <m.h2
          id="services-cta-heading"
          variants={fade(reduce)}
          className="relative mx-auto mt-3 max-w-3xl font-display text-3xl font-medium leading-snug sm:text-4xl lg:text-[2.75rem]"
        >
          {cta.text}
        </m.h2>
        <m.div variants={fade(reduce)} className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={cta.href}
            className="group inline-flex items-center gap-2 rounded-full bg-mocha-cream px-6 py-3 text-sm font-semibold text-[#2b1d1f] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mocha-cream"
          >
            {cta.label}
            <svg className="transition-transform group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href={contact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-mocha-cream/35 px-6 py-3 text-sm font-semibold transition-colors hover:bg-mocha-cream/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mocha-cream"
          >
            WhatsApp
          </a>
          <a
            href={contact.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border border-mocha-cream/35 px-6 py-3 text-sm font-semibold transition-colors hover:bg-mocha-cream/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mocha-cream"
          >
            Call Now · {contact.phone}
          </a>
        </m.div>
      </m.div>
    </section>
  );
}
