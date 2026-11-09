"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useInView, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { db } from "@/lib/db";

const { intro } = db.about;
const EASE = [0.22, 1, 0.36, 1] as const;

export function AboutIntro() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [50, -50]);

  return (
    <section ref={ref} className="relative overflow-hidden py-20 sm:py-24 lg:py-32" aria-labelledby="about-intro-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20 lg:px-8">
        {/* Copy */}
        <div>
          <m.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            <m.p variants={fade(reduce)} className="font-display text-lg italic text-deep-burgundy">
              {intro.label}
            </m.p>
            <m.h2
              id="about-intro-heading"
              variants={fade(reduce)}
              className="mt-2 font-display text-4xl font-medium leading-[1.08] text-foreground sm:text-5xl"
            >
              {intro.heading}
            </m.h2>
          </m.div>

          {/* Three pillars: each reveals in turn, its word lighting up in burgundy */}
          <ol className="mt-10 space-y-2">
            {intro.pillars.map((p, i) => (
              <Pillar key={p.word} index={i} {...p} reduce={!!reduce} />
            ))}
          </ol>

          <m.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="mt-10 max-w-xl border-l-2 border-deep-burgundy/40 pl-5 font-display text-xl italic leading-relaxed text-foreground/85 sm:text-2xl"
          >
            {intro.closing}
          </m.p>
        </div>

        {/* Photo with a polish-sweep shine */}
        <m.div
          className="relative mx-auto w-full max-w-md lg:max-w-none"
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className="absolute -right-3 -top-3 h-full w-full rounded-3xl border border-deep-burgundy/25 sm:-right-5 sm:-top-5" aria-hidden="true" />
          <m.div style={{ y: imgY }} className="group relative overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(114,47,55,0.45)]">
            <Image
              src={intro.image}
              alt="Inside The Detailing Monk studio in Rohini"
              width={625}
              height={600}
              sizes="(min-width: 1024px) 45vw, (min-width: 640px) 448px, 100vw"
              className="h-auto w-full"
            />
            {/* the "polish pass": a diagonal sheen that sweeps on reveal and again on hover */}
            <m.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-linear-to-r from-transparent via-white/55 to-transparent"
              initial={{ x: "-120%" }}
              whileInView={reduce ? {} : { x: "420%" }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.1, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -translate-x-[120%] skew-x-[-18deg] bg-linear-to-r from-transparent via-white/45 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[420%]"
            />
          </m.div>

          {/* corner tag */}
          <div className="glass absolute -bottom-4 left-5 rounded-full px-4 py-2 text-xs font-semibold tracking-[0.14em] text-deep-burgundy sm:left-8">
            Sector 11, Rohini
          </div>
        </m.div>
      </div>
    </section>
  );
}

function Pillar({ index, word, lead, text, reduce }: { index: number; word: string; lead: string; text: string; reduce: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const delay = 0.15 + index * 0.28;

  return (
    <li ref={ref} className="grid grid-cols-[2.5rem_1fr] items-start gap-4 py-3 sm:grid-cols-[3rem_1fr]">
      {/* step rail: dot + connecting line that draws down */}
      <span className="relative flex h-full flex-col items-center">
        <m.span
          className="grid h-9 w-9 place-items-center rounded-full border border-deep-burgundy/40 bg-mocha-cream font-display text-sm font-semibold text-deep-burgundy"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.45, delay, ease: EASE }}
        >
          {index + 1}
        </m.span>
        {index < 2 && (
          <m.span
            className="mt-2 w-px flex-1 origin-top bg-deep-burgundy/30"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.5, delay: delay + 0.25, ease: EASE }}
          />
        )}
      </span>

      <div>
        <m.p
          className="text-sm italic text-muted"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay }}
        >
          {lead}
        </m.p>
        <m.p
          className="font-display text-3xl font-semibold leading-none sm:text-4xl"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, color: "#B7A89A" }}
          animate={inView ? { opacity: 1, y: 0, color: "#722F37" } : {}}
          transition={{ duration: 0.6, delay: delay + 0.1, ease: EASE }}
        >
          {word}
        </m.p>
        <m.p
          className="mt-2 max-w-md text-[15px] leading-relaxed text-muted"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: delay + 0.22, ease: EASE }}
        >
          {text}
        </m.p>
      </div>
    </li>
  );
}

function fade(reduce: boolean | null): Variants {
  return {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  };
}
