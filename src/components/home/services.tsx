"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGroup, m, useReducedMotion, type Variants } from "framer-motion";
import { db } from "@/lib/db";

const { services } = db.home;
const categories = services.categories;

export function Services() {
  const reduce = useReducedMotion();
  const [activeTab, setActiveTab] = useState<string>("all");

  const shown =
    activeTab === "all"
      ? categories
      : categories.filter((c) => c.id === activeTab);

  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id="services" className="relative overflow-hidden bg-mocha-cream/45 py-20 sm:py-24 lg:py-28" aria-labelledby="services-heading">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 -top-40 h-130 w-130 rounded-full bg-cosmic-latte/35 blur-3xl" />
        <div className="absolute -bottom-48 -right-40 h-140 w-140 rounded-full bg-deep-burgundy/10 blur-3xl" />
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
            Crafted Rituals
          </span>
          <h2 id="services-heading" className="mt-3 font-display text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            {services.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{services.intro}</p>
        </m.div>

        {/* Category Filter Chips */}
        <div className="mt-10 flex justify-center">
          <LayoutGroup id="service-categories">
            <div role="tablist" aria-label="Filter service categories" className="glass-strong flex flex-wrap justify-center gap-1.5 rounded-2xl p-1.5 sm:rounded-full">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "all"}
                onClick={() => setActiveTab("all")}
                className={`relative rounded-xl px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                  activeTab === "all" ? "text-white" : "text-foreground/75 hover:text-foreground"
                }`}
              >
                {activeTab === "all" && (
                  <m.span
                    layoutId="service-tab-pill"
                    className="absolute inset-0 rounded-xl bg-deep-burgundy sm:rounded-full"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">All Services</span>
              </button>
              {categories.map((cat) => {
                const on = activeTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActiveTab(cat.id)}
                    className={`relative rounded-xl px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                      on ? "text-white" : "text-foreground/75 hover:text-foreground"
                    }`}
                  >
                    {on && (
                      <m.span
                        layoutId="service-tab-pill"
                        className="absolute inset-0 rounded-xl bg-deep-burgundy sm:rounded-full"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">{cat.title.split("&")[0].trim()}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        {/* Service Cards Grid */}
        <m.ul
          key={activeTab}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          {shown.map((c) => {
            const waText = encodeURIComponent(`Hi Detailing Monk, I am interested in booking: ${c.title}. Please provide details & quotation.`);
            const waHref = `https://wa.me/918826966825?text=${waText}`;

            return (
              <m.li
                key={c.id}
                variants={item}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-surface p-6 shadow-[0_20px_45px_-25px_rgba(114,47,55,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-deep-burgundy/50 hover:shadow-[0_28px_55px_-20px_rgba(114,47,55,0.55)] sm:p-7"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-deep-burgundy/10 text-deep-burgundy transition-colors duration-300 group-hover:bg-deep-burgundy group-hover:text-mocha-cream">
                      <ServiceIcon name={c.icon} />
                    </span>
                    <span className="rounded-full bg-deep-burgundy/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-deep-burgundy">
                      {c.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-semibold leading-snug text-foreground group-hover:text-deep-burgundy transition-colors">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted sm:text-[13px]">{c.desc}</p>

                  <ul className="mt-5 space-y-2 border-t border-border/60 pt-4 text-xs font-medium text-foreground/85">
                    {c.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-deep-burgundy/15 text-deep-burgundy">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-col gap-2.5 border-t border-border/60 pt-4">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#128c7e] py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#0d6e63]"
                  >
                    <WhatsAppIconSmall />
                    Book on WhatsApp
                  </a>
                  <Link
                    href={c.href}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-semibold text-foreground/80 transition-colors hover:border-deep-burgundy hover:text-deep-burgundy"
                  >
                    View Packages
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </m.li>
            );
          })}
        </m.ul>

        {/* CTA strip */}
        <m.div
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
        </m.div>
      </div>
    </section>
  );
}

function WhatsAppIconSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}

function ServiceIcon({ name }: { name: string }) {
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
  switch (name) {
    case "foam":
      return (
        <svg {...common}>
          <path d="M3 17h18M5 17v-3l2-4h10l2 4v3" />
          <circle cx="8" cy="6" r="2" />
          <circle cx="13" cy="4.5" r="1.5" />
          <circle cx="17" cy="7" r="1.2" />
        </svg>
      );
    case "seat":
      return (
        <svg {...common}>
          <path d="M7 4h6a2 2 0 0 1 2 2v7H7z" />
          <path d="M5 13h12l2 6H5zM7 13v-2" />
        </svg>
      );
    case "polish":
      return (
        <svg {...common}>
          <circle cx="10" cy="14" r="5" />
          <circle cx="10" cy="14" r="1.5" />
          <path d="M13.5 10.5 19 5M18 3v2M17 4h2M20 8v1M19.5 8.5h1" />
        </svg>
      );
    case "shield":
    default:
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
          <path d="M12 9c1.5 2 2.3 3 2.3 4.2a2.3 2.3 0 0 1-4.6 0C9.7 12 10.5 11 12 9z" />
        </svg>
      );
  }
}
