"use client";

import { useRef } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";
import { db } from "@/lib/db";
import { EASE } from "@/components/services/motion";

const { cards, label } = db.eco;

/* bubbles rising through the dark section (deterministic so SSR and client match) */
const BUBBLES = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 6 + ((i * 7) % 18),
  dur: 9 + ((i * 5) % 9),
  delay: -((i * 3) % 12),
}));

export function EcoCommitments() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-[#1f1517] pb-24 pt-32 text-mocha-cream sm:pb-28 sm:pt-40" aria-labelledby="eco-cards-heading">
      {/* wave edge from the page into the dark section */}
      <svg className="absolute inset-x-0 top-0 h-20 w-full text-background sm:h-28" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path className={reduce ? "" : "eco-wave"} fill="currentColor" d="M0 0h1440v58c-120 30-240 45-360 32S840 40 720 42 480 92 360 96 120 70 0 52z" />
      </svg>

      {!reduce && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {BUBBLES.map((b, i) => (
            <span
              key={i}
              className="eco-bubble absolute bottom-0 rounded-full border border-mocha-cream/25 bg-mocha-cream/5"
              style={{ left: `${b.left}%`, width: b.size, height: b.size, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}
            />
          ))}
        </div>
      )}
      <div className="pointer-events-none absolute -left-40 top-1/3 h-120 w-120 rounded-full bg-deep-burgundy/30 blur-[120px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <m.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-2xl"
        >
          <p className="font-display text-lg italic text-[#e9a970]">{db.eco.heading}</p>
          <h2 id="eco-cards-heading" className="mt-2 font-display text-4xl font-medium leading-[1.08] sm:text-5xl">
            {label}
          </h2>
        </m.div>

        <ol className="mt-14 grid gap-5 md:grid-cols-2">
          {cards.map((c, i) => (
            <Card key={c.title} index={i} reduce={!!reduce} {...c} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Card({ index: i, title, text, reduce }: { index: number; title: string; text: string; reduce: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const Icon = ICONS[i % ICONS.length];

  return (
    <m.li
      ref={ref}
      id={`eco-${i + 1}`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, ease: EASE, delay: reduce ? 0 : (i % 2) * 0.12 }}
      className="group relative scroll-mt-28 overflow-hidden rounded-3xl border border-mocha-cream/10 bg-white/3 p-7 backdrop-blur-sm transition-colors duration-500 hover:border-[#e9a970]/40 hover:bg-white/6 sm:p-9"
    >
      {/* copper edge that grows on reveal */}
      <m.span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-0.75 origin-top bg-linear-to-b from-[#e9a970] to-deep-burgundy"
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : undefined}
        transition={{ duration: 1, ease: EASE, delay: reduce ? 0 : 0.3 }}
      />
      <span aria-hidden="true" className="pointer-events-none absolute -right-6 -top-10 font-display text-[9rem] font-semibold leading-none text-mocha-cream/4 transition-colors duration-500 group-hover:text-[#e9a970]/8">
        {String(i + 1).padStart(2, "0")}
      </span>

      <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:gap-6">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#e9a970]/10 text-[#e9a970] ring-1 ring-[#e9a970]/25 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
          <Icon draw={inView} reduce={reduce} />
        </span>
        <div>
          <h3 className="font-display text-2xl font-semibold italic text-[#e9a970] sm:text-3xl">{title}</h3>
          <p className="mt-3 text-base leading-relaxed text-mocha-cream/80">{text}</p>
        </div>
      </div>
    </m.li>
  );
}

/* line icons that draw themselves in */
type IconProps = { draw: boolean; reduce: boolean };
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const drawn = (draw: boolean, reduce: boolean, delay = 0) => ({
  initial: { pathLength: reduce ? 1 : 0 },
  animate: draw ? { pathLength: 1 } : undefined,
  transition: { duration: 1.4, ease: EASE, delay: reduce ? 0 : 0.35 + delay },
});

function Drop({ draw, reduce }: IconProps) {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
      <m.path {...stroke} {...drawn(draw, reduce)} d="M12 2.8C12 2.8 5.2 10.6 5.2 15.2a6.8 6.8 0 0 0 13.6 0C18.8 10.6 12 2.8 12 2.8z" />
      <m.path {...stroke} {...drawn(draw, reduce, 0.6)} d="M9 15.5a3 3 0 0 0 3 3" />
      <m.circle cx="12" cy="21.2" r="0.1" {...stroke} animate={draw && !reduce ? { r: [0.1, 3.5], opacity: [0.8, 0] } : undefined} transition={{ duration: 2.2, repeat: Infinity, delay: 1.6 }} />
    </svg>
  );
}

function Leaf({ draw, reduce }: IconProps) {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
      <m.path {...stroke} {...drawn(draw, reduce)} d="M5 19C5 10.5 10.5 4.5 20 4.5c0 9-5.5 14.5-15 14.5z" />
      <m.path {...stroke} {...drawn(draw, reduce, 0.5)} d="M5 19l9.5-9.5M10 14h4M12 12V8.5" />
    </svg>
  );
}

function Recycle({ draw, reduce }: IconProps) {
  return (
    <m.svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true" animate={draw && !reduce ? { rotate: 360 } : undefined} transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: 1.6 }}>
      <m.path {...stroke} {...drawn(draw, reduce)} d="M19.4 9A8 8 0 0 0 6.2 6.3M4.6 15A8 8 0 0 0 17.8 17.7" />
      <m.path {...stroke} {...drawn(draw, reduce, 0.5)} d="M6.2 2.8v3.5h3.5M17.8 21.2v-3.5h-3.5" />
    </m.svg>
  );
}

function Sun({ draw, reduce }: IconProps) {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
      <m.circle cx="12" cy="12" r="4.2" {...stroke} {...drawn(draw, reduce)} />
      <m.path
        {...stroke}
        {...drawn(draw, reduce, 0.5)}
        d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"
      />
    </svg>
  );
}

const ICONS = [Drop, Leaf, Recycle, Sun];
