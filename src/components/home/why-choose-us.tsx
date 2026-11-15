"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { db } from "@/lib/db";

const { whyChooseUs } = db.home;

export function WhyChooseUs() {
  const reduce = useReducedMotion();

  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id="why-choose-us" className="relative overflow-hidden bg-background py-20 sm:py-24 lg:py-28" aria-labelledby="why-heading">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-deep-burgundy/5 blur-3xl" />
        <div className="absolute left-0 bottom-1/4 h-96 w-96 rounded-full bg-cosmic-latte/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <m.div
          className="mx-auto max-w-2xl text-center"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-deep-burgundy/25 bg-deep-burgundy/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-deep-burgundy">
            Our Standards
          </span>
          <h2 id="why-heading" className="mt-3 font-display text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            {whyChooseUs.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {whyChooseUs.subheading}
          </p>
        </m.div>

        <m.ul
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.09 } } }}
        >
          {whyChooseUs.points.map((pt, i) => (
            <m.li
              key={pt.title}
              variants={item}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-surface/70 p-7 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-deep-burgundy/40 hover:bg-surface hover:shadow-[0_20px_40px_-20px_rgba(114,47,55,0.35)] sm:p-8"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-deep-burgundy/10 text-deep-burgundy transition-colors duration-300 group-hover:bg-deep-burgundy group-hover:text-mocha-cream">
                    <FeatureIcon index={i} />
                  </span>
                  <span className="font-display text-3xl font-semibold text-deep-burgundy/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-2xl font-semibold text-foreground group-hover:text-deep-burgundy transition-colors">
                  {pt.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {pt.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-2 text-xs font-semibold text-deep-burgundy">
                <span>The Monk Guarantee</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </m.li>
          ))}
        </m.ul>
      </div>
    </section>
  );
}

function FeatureIcon({ index }: { index: number }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (index) {
    case 0: // Studio location / dust-free bay
      return (
        <svg {...common}>
          <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case 1: // Certified master detailers
      return (
        <svg {...common}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    case 2: // 100% Genuine brands
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case 3: // Seva ethos
      return (
        <svg {...common}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 4: // Transparent advice
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
    case 5: // Long term warranty
    default:
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
  }
}
