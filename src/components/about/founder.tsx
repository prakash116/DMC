"use client";

import Image from "next/image";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { db } from "@/lib/db";

const { founder } = db.about;
const EASE = [0.22, 1, 0.36, 1] as const;

export function Founder() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-mocha-cream/45 py-20 sm:py-24 lg:py-32" aria-labelledby="founder-heading">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 top-1/4 h-130 w-130 rounded-full bg-cosmic-latte/35 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-130 w-130 rounded-full bg-deep-burgundy/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:px-8">
        {/* Portrait in an arch with a drawn halo ring */}
        <m.div
          className="relative mx-auto w-65 sm:w-75 lg:w-85"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <svg viewBox="0 0 100 100" className="pointer-events-none absolute -inset-[14%] h-[128%] w-[128%]" aria-hidden="true">
            <m.circle
              cx="50"
              cy="46"
              r="46"
              fill="none"
              stroke="#722F37"
              strokeWidth="0.6"
              strokeDasharray="289"
              initial={{ strokeDashoffset: 289 }}
              whileInView={{ strokeDashoffset: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.5, delay: 0.3, ease: EASE }}
            />
            <m.circle
              cx="50"
              cy="46"
              r="41"
              fill="none"
              stroke="#B7A89A"
              strokeWidth="0.4"
              strokeDasharray="258"
              initial={{ strokeDashoffset: 258 }}
              whileInView={{ strokeDashoffset: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.3, delay: 0.55, ease: EASE }}
            />
          </svg>

          <div className="relative aspect-4/5 overflow-hidden rounded-t-full rounded-b-3xl shadow-[0_30px_60px_-28px_rgba(114,47,55,0.5)] ring-4 ring-background">
            <Image src={founder.image} alt={founder.name} fill sizes="340px" className="object-cover object-top" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-deep-burgundy/45 to-transparent" aria-hidden="true" />
          </div>

          {/* name plate */}
          <div className="glass-strong absolute -bottom-6 left-1/2 w-[88%] -translate-x-1/2 rounded-2xl px-5 py-3 text-center">
            <p className="font-display text-xl font-semibold leading-none text-foreground">{founder.name}</p>
            <p className="mt-1.5 text-[11px] font-semibold tracking-[0.16em] text-deep-burgundy">{founder.label.toUpperCase()}</p>
          </div>
        </m.div>

        {/* Bio */}
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }}
          className="text-center lg:text-left"
        >
          <m.p variants={fade(reduce)} className="font-display text-lg italic text-deep-burgundy">
            {founder.label}
          </m.p>
          <m.h2 id="founder-heading" variants={fade(reduce)} className="mt-2 font-display text-4xl font-medium leading-[1.08] text-foreground sm:text-5xl">
            {founder.name}
          </m.h2>

          {/* roles as a chip row */}
          <m.ul variants={fade(reduce)} className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start" aria-label="Roles">
            {founder.roles.map((r) => (
              <li key={r} className="rounded-full border border-deep-burgundy/30 bg-background/70 px-3.5 py-1.5 text-xs font-semibold text-deep-burgundy">
                {r}
              </li>
            ))}
          </m.ul>

          {founder.paragraphs.slice(1).map((p) => (
            <m.p key={p.slice(0, 20)} variants={fade(reduce)} className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base lg:mx-0">
              {p}
            </m.p>
          ))}

          {/* Science / Spirit / Craft */}
          <m.ul variants={fade(reduce)} className="mt-9 grid gap-3 sm:grid-cols-3">
            {founder.pillars.map((p, i) => (
              <m.li
                key={p.title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.12, ease: EASE }}
                className="group glass rounded-2xl p-5 text-left transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-deep-burgundy text-mocha-cream transition-transform duration-500 group-hover:rotate-6">
                  <PillarIcon name={p.icon} />
                </span>
                <p className="mt-4 font-display text-2xl font-semibold leading-none text-foreground">{p.title}</p>
                <p className="mt-1.5 text-sm text-muted">{p.text}</p>
              </m.li>
            ))}
          </m.ul>
        </m.div>
      </div>
    </section>
  );
}

function PillarIcon({ name }: { name: string }) {
  const c = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "gear":
      return (
        <svg {...c}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
        </svg>
      );
    case "lotus":
      return (
        <svg {...c}>
          <path d="M12 20c-3-2-5-5-5-9 2 0 4 1 5 3 1-2 3-3 5-3 0 4-2 7-5 9z" />
          <path d="M12 14c-1-3-1-6 0-9 1 3 1 6 0 9zM4 13c2 0 4 1 5 3-3 1-5 0-5-3zM20 13c-2 0-4 1-5 3 3 1 5 0 5-3z" />
        </svg>
      );
    case "hand":
    default:
      return (
        <svg {...c}>
          <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V12M14 11.5V6.5a1.5 1.5 0 0 1 3 0V13" />
          <path d="M17 13v1a6 6 0 0 1-12 0v-3.5a1.5 1.5 0 0 1 3 0V13" />
        </svg>
      );
  }
}

function fade(reduce: boolean | null): Variants {
  return {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  };
}
