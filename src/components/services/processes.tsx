"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m, useInView, useReducedMotion } from "framer-motion";
import { db } from "@/lib/db";
import { fade, EASE } from "./motion";

const { processes } = db.services;
const pad = (n: number) => String(n).padStart(2, "0");

/*
 * Scroll story: the photo stays pinned on the left (desktop) and swaps as each step
 * crosses the middle of the screen; a progress rail fills alongside the steps.
 */
export function ServicesProcesses() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const item = processes.items[active];

  return (
    <section id="processes" className="relative scroll-mt-28 bg-surface-muted/50 py-20 sm:py-24 lg:py-28" aria-labelledby="processes-heading">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="max-w-2xl"
        >
          <m.h2 id="processes-heading" variants={fade(reduce)} className="font-display text-4xl font-medium leading-[1.08] sm:text-5xl">
            {processes.heading}
          </m.h2>
          <m.p variants={fade(reduce)} className="mt-4 text-base leading-relaxed text-foreground/75 sm:text-lg">
            {processes.intro}
          </m.p>
        </m.div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20">
          {/* Pinned photo (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <div className="relative aspect-400/383 overflow-hidden rounded-3xl bg-cosmic-latte shadow-[0_30px_60px_-30px_rgba(114,47,55,0.5)]">
                <AnimatePresence initial={false}>
                  <m.div
                    key={item.image}
                    className="absolute inset-0"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08, clipPath: "inset(0 0 100% 0 round 24px)" }}
                    animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0 0% 0 round 24px)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    <Image src={item.image} alt={item.title} fill sizes="45vw" className="object-cover" />
                  </m.div>
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#2b1d1f]/65 via-transparent to-transparent" />
                <div className="absolute inset-x-6 bottom-5 flex items-end justify-between gap-4 text-mocha-cream">
                  <AnimatePresence mode="wait" initial={false}>
                    <m.p
                      key={item.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="font-display text-2xl italic"
                    >
                      {item.title}
                    </m.p>
                  </AnimatePresence>
                  <p className="shrink-0 font-display text-sm tracking-widest">
                    {pad(active + 1)} / {pad(processes.items.length)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <ol className="relative">
            {/* rail */}
            <span className="absolute bottom-6 left-5.5 top-6 w-px bg-foreground/12 sm:left-6.5" aria-hidden="true" />
            <m.span
              className="absolute left-5.5 top-6 w-px origin-top bg-primary sm:left-6.5"
              style={{ height: "calc(100% - 3rem)" }}
              animate={{ scaleY: (active + 1) / processes.items.length }}
              transition={{ duration: 0.5, ease: EASE }}
              aria-hidden="true"
            />
            {processes.items.map((p, i) => (
              <Step key={p.title} index={i} active={i === active} done={i < active} onActive={setActive} {...p} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({
  index,
  title,
  text,
  image,
  active,
  done,
  onActive,
}: {
  index: number;
  title: string;
  text: string;
  image: string;
  active: boolean;
  done: boolean;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // "active" when the step sits across the middle band of the viewport
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li ref={ref} className="relative flex gap-5 pb-14 last:pb-0 sm:gap-7 lg:min-h-[38vh] lg:pb-0">
      <span
        className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border font-display text-base font-semibold transition-colors duration-500 sm:h-13 sm:w-13 sm:text-lg ${
          active
            ? "border-primary bg-primary text-primary-foreground shadow-[0_10px_24px_-8px_var(--deep-burgundy)]"
            : done
              ? "border-primary bg-background text-primary"
              : "border-foreground/15 bg-background text-muted"
        }`}
      >
        {pad(index + 1)}
      </span>
      <div className={`pt-1.5 transition-opacity duration-500 lg:pt-2.5 ${active ? "opacity-100" : "lg:opacity-45"}`}>
        <h3 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">{title}</h3>
        <p className="mt-3 max-w-md text-base leading-relaxed text-foreground/75">{text}</p>
        {/* inline photo on small screens (no pinned column there) */}
        <div className="relative mt-5 aspect-400/383 max-w-sm overflow-hidden rounded-2xl lg:hidden">
          <Image src={image} alt={title} fill sizes="(min-width: 640px) 384px, 90vw" className="object-cover" />
        </div>
      </div>
    </li>
  );
}
