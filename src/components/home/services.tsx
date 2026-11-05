"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGroup, motion, useReducedMotion, type Variants } from "framer-motion";
import { db } from "@/lib/db";

const { services } = db.home;
const cards = services.cards;
const DEFAULT_ACTIVE = 1;

export function Services() {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? DEFAULT_ACTIVE;

  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="relative overflow-hidden bg-mocha-cream/45 py-20 sm:py-24 lg:py-28" aria-labelledby="services-heading">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 -top-40 h-130 w-130 rounded-full bg-cosmic-latte/35 blur-3xl" />
        <div className="absolute -bottom-48 -right-40 h-140 w-140 rounded-full bg-deep-burgundy/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 id="services-heading" className="font-display text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            {services.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{services.intro}</p>
        </motion.div>

        <LayoutGroup id="services">
          <motion.ul
            className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            onMouseLeave={() => setHovered(null)}
          >
            {cards.map((c, i) => {
              const isActive = i === active;
              return (
                <motion.li
                  key={c.title}
                  variants={item}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  className={`relative isolate flex flex-col rounded-3xl p-7 ring-1 transition-[color,box-shadow] duration-400 sm:p-8 ${
                    isActive
                      ? "text-mocha-cream shadow-[0_30px_60px_-28px_rgba(114,47,55,0.8)] ring-deep-burgundy/40"
                      : "bg-surface text-foreground shadow-[0_18px_40px_-30px_rgba(114,47,55,0.4)] ring-border/70"
                  }`}
                >
                  {/* The burgundy fill slides between cards */}
                  {isActive && (
                    <motion.span
                      layoutId="services-highlight"
                      aria-hidden="true"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 32 }}
                      className="absolute inset-0 -z-10 overflow-hidden rounded-3xl bg-deep-burgundy"
                    >
                      <span className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-mocha-cream/15" />
                      <span className="absolute right-6 top-16 h-16 w-16 rounded-full bg-mocha-cream/10" />
                      <span className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-[#1c1214]/25" />
                    </motion.span>
                  )}

                  <div className="flex items-start justify-between">
                    <span
                      className={`grid h-14 w-14 place-items-center rounded-2xl transition-colors duration-400 ${
                        isActive ? "bg-mocha-cream/15 text-mocha-cream" : "bg-mocha-cream text-deep-burgundy"
                      }`}
                    >
                      <ServiceIcon name={c.icon} />
                    </span>
                    <span
                      className={`font-display text-4xl font-semibold leading-none transition-colors duration-400 ${
                        isActive ? "text-mocha-cream/35" : "text-cosmic-latte/60"
                      }`}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-semibold leading-snug sm:text-[1.65rem]">{c.title}</h3>
                  <p className={`mt-2.5 flex-1 text-[14.5px] leading-relaxed ${isActive ? "text-mocha-cream/80" : "text-muted"}`}>
                    {c.text}
                  </p>

                  <Link
                    href={c.href}
                    className={`mt-6 inline-flex w-fit items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      isActive
                        ? "border-mocha-cream/40 text-mocha-cream hover:bg-mocha-cream hover:text-deep-burgundy focus-visible:outline-mocha-cream"
                        : "border-border text-foreground hover:border-deep-burgundy hover:text-deep-burgundy focus-visible:outline-deep-burgundy"
                    }`}
                  >
                    View more
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </LayoutGroup>

        {/* CTA strip */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="glass mx-auto mt-12 flex max-w-4xl flex-col items-center gap-4 rounded-2xl px-6 py-5 text-center sm:mt-16 sm:flex-row sm:text-left"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-deep-burgundy text-mocha-cream" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z" />
            </svg>
          </span>
          <p className="flex-1 text-[15px] font-medium leading-snug text-foreground sm:text-base">{services.cta.text}</p>
          <a
            href={services.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-full bg-deep-burgundy px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_var(--deep-burgundy)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy"
          >
            {services.cta.label}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* Line icons in one consistent stroke style */
function ServiceIcon({ name }: { name: string }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "foam": // bubbles over a car roofline
      return (
        <svg {...common}>
          <path d="M3 17h18M5 17v-3l2-4h10l2 4v3" />
          <circle cx="8" cy="6" r="2" />
          <circle cx="13" cy="4.5" r="1.5" />
          <circle cx="17" cy="7" r="1.2" />
        </svg>
      );
    case "seat": // car seat
      return (
        <svg {...common}>
          <path d="M7 4h6a2 2 0 0 1 2 2v7H7z" />
          <path d="M5 13h12l2 6H5zM7 13v-2" />
        </svg>
      );
    case "polish": // polisher pad with sparkle
      return (
        <svg {...common}>
          <circle cx="10" cy="14" r="5" />
          <circle cx="10" cy="14" r="1.5" />
          <path d="M13.5 10.5 19 5M18 3v2M17 4h2M20 8v1M19.5 8.5h1" />
        </svg>
      );
    case "shield": // shield with a droplet
    default:
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
          <path d="M12 9c1.5 2 2.3 3 2.3 4.2a2.3 2.3 0 0 1-4.6 0C9.7 12 10.5 11 12 9z" />
        </svg>
      );
  }
}
