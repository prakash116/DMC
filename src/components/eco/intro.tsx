"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { db } from "@/lib/db";
import { fade } from "@/components/services/motion";
import { ScrollWords } from "@/components/ui/scroll-words";

const eco = db.eco;

export function EcoIntro() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [50, -50]);

  return (
    <section ref={ref} className="relative overflow-hidden py-20 sm:py-24 lg:py-32" aria-labelledby="eco-intro-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20 lg:px-8">
        <div>
          <m.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }} variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
            <m.p variants={fade(reduce)} className="font-display text-lg italic text-primary">
              {eco.label}
            </m.p>
            <m.h2 id="eco-intro-heading" variants={fade(reduce)} className="mt-2 font-display text-4xl font-medium leading-[1.08] sm:text-5xl">
              {eco.heading}
            </m.h2>
          </m.div>
          <p className="mt-8 font-display text-2xl leading-snug text-foreground sm:text-3xl lg:text-[2.1rem]">
            <ScrollWords text={eco.intro} />
          </p>
          {/* the four commitments as quick jump chips */}
          <m.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            className="mt-10 flex flex-wrap gap-2.5"
          >
            {eco.cards.map((c, i) => (
              <m.li key={c.title} variants={fade(reduce)}>
                <a
                  href={`#eco-${i + 1}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="font-display text-xs font-semibold text-primary">{String(i + 1).padStart(2, "0")}</span>
                  {c.title}
                </a>
              </m.li>
            ))}
          </m.ul>
        </div>

        {/* photo inside a slow water-ripple */}
        <div className="hero-rise relative mx-auto w-full max-w-md lg:max-w-none" style={{ animationDelay: "150ms" }}>
          {[0, 1, 2].map((k) => (
            <span key={k} aria-hidden="true" className="eco-ripple absolute inset-0 rounded-[2.5rem] border border-primary/30" style={{ animationDelay: `${k * 1.2}s` }} />
          ))}
          <m.div style={{ y: imgY }} className="relative overflow-hidden rounded-[2.5rem] shadow-[0_30px_60px_-30px_rgba(114,47,55,0.5)]">
            <Image src={eco.image} alt={eco.heading} width={585} height={560} sizes="(min-width: 1024px) 40vw, 90vw" loading="eager" fetchPriority="high" className="h-auto w-full" />
          </m.div>
        </div>
      </div>
    </section>
  );
}
