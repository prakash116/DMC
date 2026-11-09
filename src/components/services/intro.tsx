"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { db } from "@/lib/db";
import { fade } from "./motion";

const { intro, processes, tiers } = db.services;
const serviceCount = tiers.items.reduce((n, t) => n + t.services.length, 0);
const stats = [
  { value: serviceCount, label: "Services" },
  { value: tiers.items.length, label: "Care tiers" },
  { value: processes.items.length, label: "Core processes" },
];

export function ServicesIntro() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const [p1, p2, p3] = intro.paragraphs;

  return (
    <section id="overview" ref={ref} className="relative scroll-mt-28 overflow-hidden py-20 sm:py-24 lg:py-28" aria-labelledby="services-intro-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20 lg:px-8">
        {/* Photo */}
        {/* CSS entrance: this photo is the mobile LCP, so it must paint without waiting for JS */}
        <div className="hero-rise relative mx-auto w-full max-w-md lg:max-w-none" style={{ animationDelay: "150ms" }}>
          <div className="absolute -bottom-3 -left-3 h-full w-full rounded-3xl border border-deep-burgundy/25 sm:-bottom-5 sm:-left-5" aria-hidden="true" />
          <m.div style={{ y: imgY }} className="relative overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(114,47,55,0.45)]">
            <Image
              src={intro.image}
              alt={intro.heading}
              width={585}
              height={560}
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 448px, 100vw"
              loading="eager"
              fetchPriority="high"
              className="h-auto w-full"
            />
          </m.div>
          {/* stats chip overlapping the photo */}
          <div className="glass-strong absolute -bottom-8 right-4 flex gap-5 rounded-2xl px-5 py-4 sm:right-8 sm:gap-7 sm:px-7">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-semibold leading-none text-primary sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-[11px] font-medium tracking-wide text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Copy */}
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ show: { transition: { staggerChildren: 0.09 } } }}
          className="pt-6 lg:pt-0"
        >
          <m.p variants={fade(reduce)} className="font-display text-lg italic text-primary">
            {intro.label}
          </m.p>
          <m.h2 id="services-intro-heading" variants={fade(reduce)} className="mt-2 font-display text-4xl font-medium leading-[1.08] text-foreground sm:text-5xl">
            {intro.heading}
          </m.h2>
          <m.p variants={fade(reduce)} className="mt-7 text-base leading-relaxed text-foreground/80 sm:text-lg">
            {p1}
          </m.p>
          {/* callout */}
          <m.blockquote
            variants={fade(reduce)}
            className="mt-7 rounded-r-2xl border-l-2 border-primary bg-surface-muted/60 py-5 pl-6 pr-5 font-display text-xl italic leading-relaxed text-foreground/90 sm:text-2xl"
          >
            {p2}
          </m.blockquote>
          <m.p variants={fade(reduce)} className="mt-7 text-base leading-relaxed text-foreground/80 sm:text-lg">
            {p3}
          </m.p>
        </m.div>
      </div>
    </section>
  );
}
