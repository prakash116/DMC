"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { db } from "@/lib/db";
import { fade, EASE } from "@/components/services/motion";

/* Where the products end up: the three product-heavy processes from the Services content */
const { processes } = db.services;
const picks = processes.items.slice(0, 3);

export function BrandsInUse() {
  const reduce = useReducedMotion();
  return (
    <section className="py-20 sm:py-24 lg:py-28" aria-labelledby="brands-in-use-heading">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <m.h2 id="brands-in-use-heading" variants={fade(reduce)} className="font-display text-4xl font-medium leading-[1.08] sm:text-5xl">
              {processes.heading}
            </m.h2>
            <m.p variants={fade(reduce)} className="mt-4 text-base leading-relaxed text-foreground/75 sm:text-lg">
              {processes.intro}
            </m.p>
          </div>
          <m.div variants={fade(reduce)}>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {db.services.banner.title}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </m.div>
        </m.div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {picks.map((p, i) => (
            <Card key={p.title} index={i} reduce={!!reduce} {...p} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/* card: clip-reveals upward on scroll, photo drifts (parallax), text lifts on hover */
function Card({ index: i, title, text, image, reduce }: { index: number; title: string; text: string; image: string; reduce: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-9%", "9%"]);
  return (
    <m.li
      ref={ref}
      initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(30% 0 0 0 round 24px)", y: 40 }}
      whileInView={{ opacity: 1, clipPath: "inset(0% 0 0 0 round 24px)", y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: EASE, delay: reduce ? 0 : i * 0.12 }}
    >
      <Link
        href="/services#processes"
        className="group relative block overflow-hidden rounded-3xl bg-[#2b1d1f] text-mocha-cream shadow-[0_30px_60px_-30px_rgba(114,47,55,0.55)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <div className="relative aspect-4/5 overflow-hidden sm:aspect-400/383 md:aspect-4/5">
          <m.div style={{ y: imgY }} className="absolute -inset-y-[10%] inset-x-0">
            <Image src={image} alt={title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover opacity-70 transition-[transform,opacity] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105 group-hover:opacity-85" />
          </m.div>
          <div className="absolute inset-0 bg-linear-to-t from-[#2b1d1f] via-[#2b1d1f]/45 to-transparent" />
        </div>
        <div className="absolute inset-x-6 bottom-6 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2">
          <p className="font-display text-sm tracking-widest text-[#e9a970]">{String(i + 1).padStart(2, "0")}</p>
          <h3 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-mocha-cream/80">{text}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#e9a970] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {db.services.banner.title}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
        </div>
      </Link>
    </m.li>
  );
}
