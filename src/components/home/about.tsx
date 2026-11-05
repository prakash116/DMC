"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { animate, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { db } from "@/lib/db";

const { about } = db.home;
const { tagline } = db.site;
const EASE = [0.22, 1, 0.36, 1] as const;

export function About() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28" aria-labelledby="about-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Copy */}
        <motion.div
          className="text-center lg:text-left"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
        >
          <motion.p variants={fade(reduce)} className="font-display text-lg italic text-deep-burgundy">
            {about.label}
          </motion.p>
          <motion.h2
            id="about-heading"
            variants={fade(reduce)}
            className="mt-2 font-display text-4xl font-medium leading-[1.08] text-foreground sm:text-5xl lg:text-[3.4rem]"
          >
            {about.heading}
          </motion.h2>

          {about.paragraphs.map((p) => (
            <motion.p key={p.slice(0, 24)} variants={fade(reduce)} className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base lg:mx-0">
              {p}
            </motion.p>
          ))}

          {/* Ring stats */}
          <motion.ul variants={fade(reduce)} className="mx-auto mt-9 grid max-w-md grid-cols-2 gap-4 lg:mx-0 lg:flex lg:gap-10">
            {about.stats.map((s) => (
              <li key={s.label} className="flex items-center gap-3 text-left lg:gap-4">
                <RingStat value={s.value} suffix={s.suffix} reduce={!!reduce} />
                <span className="max-w-32 text-sm font-medium leading-snug text-foreground sm:text-[15px]">{s.label}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fade(reduce)} className="mt-9 flex flex-wrap items-center justify-center gap-5 lg:justify-start">
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
          </motion.div>
        </motion.div>

        {/* Photo: bleeds to the right edge on desktop, floating info card over its corner */}
        <motion.div
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

          <motion.div
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* Circular progress that draws itself and counts up the first time it scrolls into view */
function RingStat({ value, suffix, reduce }: { value: number; suffix: string; reduce: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [n, setN] = useState(reduce ? value : 0);
  const R = 26;
  const C = 2 * Math.PI * R;
  const pct = suffix === "%" ? value / 100 : 1;

  useEffect(() => {
    if (!inView || reduce) return;
    const ctrl = animate(0, value, { duration: 1.4, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => ctrl.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="relative grid h-16 w-16 shrink-0 place-items-center sm:h-18 sm:w-18">
      <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={R} className="fill-none stroke-cosmic-latte/50" strokeWidth="4" />
        <motion.circle
          cx="32"
          cy="32"
          r={R}
          className="fill-none stroke-deep-burgundy"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: reduce ? C * (1 - pct) : C }}
          animate={{ strokeDashoffset: inView ? C * (1 - pct) : C }}
          transition={{ duration: 1.4, ease: EASE }}
        />
      </svg>
      <span className="font-display text-xl font-semibold text-foreground">
        {n}
        {suffix}
      </span>
    </span>
  );
}

function fade(reduce: boolean | null): Variants {
  return {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  };
}
