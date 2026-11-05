"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { db } from "@/lib/db";

const PhilosophyScene = dynamic(() => import("./philosophy-scene").then((m) => m.PhilosophyScene), { ssr: false });

const { philosophy } = db.about;
const EASE = [0.22, 1, 0.36, 1] as const;

export function Philosophy() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const cardY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [36, -36]);

  return (
    <section ref={ref} className="relative overflow-hidden py-24 sm:py-28 lg:py-36" aria-labelledby="philosophy-heading">
      {/* Ripples */}
      <div className="absolute inset-0" aria-hidden="true">
        <PhilosophyScene reducedMotion={!!reduce} />
        <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.p variants={fade(reduce)} className="font-display text-lg italic text-deep-burgundy">
            {philosophy.label}
          </motion.p>
          <motion.h2
            id="philosophy-heading"
            variants={fade(reduce)}
            className="mt-2 font-display text-4xl font-medium leading-[1.08] text-foreground sm:text-5xl lg:text-6xl"
          >
            {philosophy.heading}
          </motion.h2>
          <motion.p variants={fade(reduce)} className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg">
            {philosophy.text}
          </motion.p>

          {/* Three virtues joined by a drawn line */}
          <motion.ul variants={fade(reduce)} className="mx-auto mt-8 flex max-w-md items-center justify-between" aria-label="Our practice">
            {philosophy.virtues.map((v, i) => (
              <li key={v} className="flex flex-1 items-center">
                {i > 0 && (
                  <motion.span
                    className="h-px flex-1 origin-left bg-deep-burgundy/40"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.2, ease: EASE }}
                    aria-hidden="true"
                  />
                )}
                <span className="flex flex-col items-center gap-2 px-3">
                  <span className="h-2 w-2 rotate-45 bg-deep-burgundy" aria-hidden="true" />
                  <span className="font-display text-lg text-foreground sm:text-xl">{v}</span>
                </span>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Quote inside a drawn circle */}
        <motion.figure
          style={{ y: cardY }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="relative mx-auto mt-14 max-w-2xl sm:mt-16"
        >
          <svg viewBox="0 0 100 100" className="pointer-events-none absolute left-1/2 top-1/2 h-[135%] w-auto -translate-x-1/2 -translate-y-1/2 sm:h-[150%]" aria-hidden="true">
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#722F37"
              strokeWidth="0.5"
              strokeDasharray="301.6"
              initial={{ strokeDashoffset: 301.6, opacity: 0.5 }}
              whileInView={{ strokeDashoffset: 0, opacity: 0.5 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.6, delay: 0.4, ease: EASE }}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="43"
              fill="none"
              stroke="#E8DCC6"
              strokeWidth="0.9"
              strokeDasharray="270.2"
              initial={{ strokeDashoffset: 270.2 }}
              whileInView={{ strokeDashoffset: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.4, delay: 0.6, ease: EASE }}
            />
          </svg>

          <div className="glass-strong relative rounded-3xl px-7 py-9 sm:px-12 sm:py-12">
            <span className="absolute -top-5 left-1/2 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full bg-deep-burgundy text-mocha-cream" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7.5 6C5 6 3 8 3 10.5c0 2.2 1.6 4 3.7 4.4-.4 1.6-1.6 2.6-3.2 3.1v2c3.4-.6 6-3.4 6-7.5V6H7.5zm10 0C15 6 13 8 13 10.5c0 2.2 1.6 4 3.7 4.4-.4 1.6-1.6 2.6-3.2 3.1v2c3.4-.6 6-3.4 6-7.5V6h-2z" /></svg>
            </span>
            <blockquote className="font-display text-2xl italic leading-snug text-foreground sm:text-[2rem]">
              “{philosophy.quote}”
            </blockquote>
            <figcaption className="mt-5 text-xs font-semibold tracking-[0.18em] text-deep-burgundy">{philosophy.quoteSource.toUpperCase()}</figcaption>
          </div>
        </motion.figure>

        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="mx-auto mt-12 max-w-xl text-[15px] leading-relaxed text-muted sm:mt-14 sm:text-base"
        >
          {philosophy.closing}
        </motion.p>
      </div>
    </section>
  );
}

function fade(reduce: boolean | null): Variants {
  return {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };
}
