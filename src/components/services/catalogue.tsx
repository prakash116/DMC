"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, m, useReducedMotion } from "framer-motion";
import { db } from "@/lib/db";
import { fade, EASE, splitService } from "./motion";

const { tiers } = db.services;
const { contact } = db.site;

/* tier → photo + icon (all from the services image set) */
const LOOK: Record<string, { image: string; icon: string }> = {
  "general-care": { image: "/images/services/foam-detailed-washes-serv.jpg", icon: "/icons/car-wash.svg" },
  "paint-restoration": { image: "/images/services/polishing-restoration-serv.jpg", icon: "/icons/car-wax.svg" },
  "speciality-care": { image: "/images/services/special-treatments-serv.jpg", icon: "/icons/car-detailing.svg" },
};

const waLink = (service: string) => `${contact.whatsappHref}?text=${encodeURIComponent(`Hi, I'd like to book: ${service}`)}`;

export function ServicesCatalogue() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query.trim().toLowerCase());
  const [current, setCurrent] = useState(tiers.items[0].id);

  const filtered = useMemo(
    () =>
      tiers.items.map((t) => ({
        ...t,
        list: t.services.map(splitService).filter((s) => !q || `${s.name} ${s.detail}`.toLowerCase().includes(q)),
      })),
    [q],
  );
  const total = filtered.reduce((n, t) => n + t.list.length, 0);

  // highlight the tier chip for whichever tier is on screen
  useEffect(() => {
    const els = tiers.items.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [q]);

  return (
    <section id="all-services" className="relative scroll-mt-24 py-20 sm:py-24 lg:py-28" aria-labelledby="all-services-heading">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="max-w-2xl"
        >
          <m.p variants={fade(reduce)} className="font-display text-lg italic text-primary">
            {tiers.label}
          </m.p>
          <m.h2 id="all-services-heading" variants={fade(reduce)} className="mt-2 font-display text-4xl font-medium leading-[1.08] sm:text-5xl">
            {tiers.heading}
          </m.h2>
          <m.p variants={fade(reduce)} className="mt-4 text-base leading-relaxed text-foreground/75 sm:text-lg">
            {tiers.intro}
          </m.p>
        </m.div>

        {/* Sticky tool bar: tier jump chips + search */}
        <div className="sticky top-20 z-30 mt-10 lg:top-24">
          <div className="glass-strong flex flex-col gap-3 rounded-2xl p-2.5 sm:flex-row sm:items-center sm:justify-between">
            <LayoutGroup id="tier-chips">
              <nav aria-label="Service tiers" className="-mx-1 overflow-x-auto px-1 [scrollbar-width:none]">
                <ul className="flex gap-1.5">
                  {filtered.map((t) => {
                    const on = current === t.id;
                    return (
                      <li key={t.id}>
                        <a
                          href={`#${t.id}`}
                          aria-current={on ? "true" : undefined}
                          className={`relative flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                            on ? "text-primary-foreground" : t.list.length === 0 ? "pointer-events-none text-foreground/35" : "text-foreground/75 hover:text-foreground"
                          }`}
                        >
                          {on && (
                            <m.span
                              layoutId="tier-chip"
                              className="absolute inset-0 rounded-xl bg-primary"
                              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                            />
                          )}
                          <span className="relative">{t.title}</span>
                          <span className={`relative rounded-full px-1.5 text-[11px] font-semibold ${on ? "bg-white/20" : "bg-foreground/8"}`}>
                            {t.list.length}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </LayoutGroup>
            <label className="relative block sm:w-64">
              <span className="sr-only">Find a service</span>
              <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a service…"
                className="w-full rounded-xl border border-border bg-surface/80 py-2 pl-10 pr-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>
          <p className="sr-only" aria-live="polite">
            {q ? `${total} services match “${query}”` : ""}
          </p>
        </div>

        {/* Tiers */}
        <div className="mt-12 space-y-20 sm:space-y-24">
          {filtered.map((t, ti) =>
            t.list.length === 0 ? null : (
              <section key={t.id} id={t.id} className="grid scroll-mt-44 gap-8 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] lg:gap-14" aria-labelledby={`${t.id}-title`}>
                {/* tier card */}
                <m.div
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="lg:sticky lg:top-48 lg:self-start"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-[#2b1d1f] text-mocha-cream shadow-[0_30px_60px_-30px_rgba(114,47,55,0.55)]">
                    <Image src={LOOK[t.id].image} alt="" width={400} height={383} sizes="(min-width: 1024px) 30vw, 100vw" className="h-40 w-full object-cover opacity-55 sm:h-64 lg:h-72" />
                    <div className="absolute inset-0 bg-linear-to-t from-[#2b1d1f] via-[#2b1d1f]/40 to-transparent" />
                    <div className="absolute inset-x-6 bottom-6">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-9 w-9 bg-[#e9a970]"
                          style={{ maskImage: `url(${LOOK[t.id].icon})`, WebkitMaskImage: `url(${LOOK[t.id].icon})`, maskSize: "contain", maskRepeat: "no-repeat" }}
                          aria-hidden="true"
                        />
                        <span className="rounded-full border border-mocha-cream/30 px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.14em] uppercase">{t.tier}</span>
                      </div>
                      <h3 id={`${t.id}-title`} className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                        {t.title}
                      </h3>
                      <p className="mt-2 text-sm text-mocha-cream/75">
                        {t.list.length} {t.list.length === 1 ? "service" : "services"}
                      </p>
                    </div>
                  </div>
                </m.div>

                {/* service cards */}
                <m.ul layout={!reduce && q !== ""} className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  <AnimatePresence initial={false}>
                    {t.list.map((s, i) => (
                      <m.li
                        key={s.name + s.detail}
                        layout={!reduce && q !== ""}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.45, ease: EASE, delay: reduce ? 0 : (i % 6) * 0.04 }}
                      >
                        <a
                          href={waLink(s.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_40px_-24px_rgba(114,47,55,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          <span className="flex items-start gap-3.5">
                            <span className="mt-0.5 font-display text-sm font-semibold text-primary">{String(ti + 1)}.{String(i + 1).padStart(2, "0")}</span>
                            <span className="min-w-0">
                              <span className="block font-semibold leading-snug text-foreground">{s.name}</span>
                              {s.detail && <span className="mt-1.5 block text-sm leading-relaxed text-muted">{s.detail}</span>}
                            </span>
                          </span>
                          <span className="mt-auto flex items-center gap-1.5 pl-9 pt-4 text-xs font-semibold text-primary">
                            <WhatsAppIcon /> Enquire on WhatsApp
                            <svg className="transition-transform duration-300 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M5 12h14M13 5l7 7-7 7" />
                            </svg>
                          </span>
                        </a>
                      </m.li>
                    ))}
                  </AnimatePresence>
                </m.ul>
              </section>
            ),
          )}

          {total === 0 && (
            <div className="rounded-3xl border border-dashed border-border px-6 py-14 text-center">
              <p className="font-display text-2xl">No service matches “{query}”.</p>
              <p className="mt-2 text-sm text-muted">Tell us what your car needs and we&apos;ll suggest the right care.</p>
              <a
                href={waLink(query)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                <WhatsAppIcon /> Ask on WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}
