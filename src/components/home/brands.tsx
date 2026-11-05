"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { db } from "@/lib/db";

const { brands } = db.home;
const { logos, logoDir } = db.brands;

// Two rows, split evenly, each row scrolling the opposite way
const half = Math.ceil(logos.length / 2);
const rows = [logos.slice(0, half), logos.slice(half)];

export function Brands() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28" aria-labelledby="brands-heading">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 id="brands-heading" className="font-display text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            {brands.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{brands.text}</p>
        </motion.div>
      </div>

      {/* Marquee rows — full-bleed, faded at both edges */}
      <motion.div
        className="mt-12 flex flex-col gap-4 sm:mt-16 sm:gap-5 mask-[linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {rows.map((row, r) => (
          <div
            key={r}
            className="marquee overflow-hidden"
            style={{ "--marquee-duration": `${row.length * 5.5}s` } as React.CSSProperties}
          >
            <ul className={`marquee-track flex w-max gap-4 sm:gap-5 ${r === 1 ? "is-reverse" : ""}`}>
              {[0, 1].map((copy) =>
                row.map((logo) => (
                  <li key={`${copy}-${logo.file}`} aria-hidden={copy === 1 || undefined}>
                    <Link
                      href="/brands"
                      tabIndex={copy === 1 ? -1 : 0}
                      aria-label={logo.name}
                      className="group block rounded-2xl bg-white p-3 ring-1 ring-border/70 shadow-[0_14px_30px_-24px_rgba(114,47,55,0.6)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1.5 hover:shadow-[0_22px_40px_-22px_rgba(114,47,55,0.55)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-deep-burgundy"
                    >
                      <Image
                        src={`${logoDir}/${logo.file}.webp`}
                        alt={logo.name}
                        width={200}
                        height={150}
                        sizes="160px"
                        className="h-20 w-34 object-contain sm:h-24 sm:w-40"
                      />
                    </Link>
                  </li>
                )),
              )}
            </ul>
          </div>
        ))}
      </motion.div>

      <div className="mt-10 text-center sm:mt-12">
        <Link
          href={brands.link.href}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-deep-burgundy hover:text-deep-burgundy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy"
        >
          {brands.link.label}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
