"use client";

import { useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { db } from "@/lib/db";
import { EASE } from "@/components/services/motion";
import { OpenStatus } from "./open-status";

const page = db.contact;
const { contact } = db.site;

type Row = { label: string; value: string; href?: string; copy?: string; icon: string; external?: boolean };
const rows: Row[] = [
  { label: "Phone Number", value: contact.phone, href: contact.phoneHref, copy: contact.phone, icon: "/icons/mobile-icon.svg" },
  { label: "Whatsapp Number", value: contact.whatsapp.replace(/^91/, ""), href: contact.whatsappHref, copy: contact.whatsapp.replace(/^91/, ""), icon: "/icons/whatsapp-icon.svg", external: true },
  { label: "Email", value: contact.email, href: `mailto:${contact.email}`, copy: contact.email, icon: "/icons/email-icon.svg" },
  { label: "Address", value: `${contact.address.line1}, ${contact.address.line2}`, href: contact.directionsHref, copy: `${contact.address.line1}, ${contact.address.line2}`, icon: "/icons/location-map-icon.svg", external: true },
  { label: "Office Timing", value: `${contact.hours} · ${contact.closed} is Off`, icon: "/icons/clock-icon.svg" },
];

export function GetInTouch() {
  const reduce = useReducedMotion();
  return (
    <section className="relative py-20 sm:py-24 lg:py-28" aria-labelledby="touch-heading">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:px-8">
        {/* left: heading + quick actions */}
        <div className="lg:sticky lg:top-32">
          <div style={{ animationDelay: `100ms` }} className="hero-rise">
            <OpenStatus />
          </div>
          <h2 id="touch-heading" style={{ animationDelay: "150ms" }} className="hero-rise mt-5 font-display text-5xl font-medium leading-[1.04] sm:text-6xl">
            {page.heading}
          </h2>
          <p style={{ animationDelay: `190ms` }} className="hero-rise mt-5 max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">
            {page.intro}
          </p>
          <div style={{ animationDelay: `280ms` }} className="hero-rise mt-8 flex flex-wrap gap-3">
            <a
              href={page.cta.href}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_30px_-10px_var(--deep-burgundy)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {page.cta.label}
              <svg className="transition-transform group-hover:translate-y-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </a>
            <a
              href={contact.phoneHref}
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Call Now
            </a>
          </div>
        </div>

        {/* right: contact card */}
        <m.ul
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_30px_60px_-36px_rgba(114,47,55,0.5)]"
        >
          {rows.map((r, i) => (
            <ContactRow key={r.label} row={r} index={i} reduce={!!reduce} />
          ))}
        </m.ul>
      </div>
    </section>
  );
}

function ContactRow({ row, index, reduce }: { row: Row; index: number; reduce: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!row.copy) return;
    try {
      await navigator.clipboard.writeText(row.copy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const Value = row.href ? "a" : "span";
  return (
    <m.li
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: EASE, delay: reduce ? 0 : 0.15 + index * 0.07 }}
      className="group relative flex items-center gap-4 px-5 py-5 transition-colors hover:bg-surface-muted/40 sm:gap-5 sm:px-7 sm:py-6"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 transition-[transform,background-color] duration-500 group-hover:-rotate-6 group-hover:bg-primary">
        <span
          aria-hidden="true"
          className="h-5.5 w-5.5 bg-primary transition-colors duration-500 group-hover:bg-primary-foreground"
          style={{ maskImage: `url(${row.icon})`, WebkitMaskImage: `url(${row.icon})`, maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center" }}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium tracking-wide text-muted">{row.label}</span>
        <Value
          {...(row.href ? { href: row.href, ...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {}) } : {})}
          className={`mt-0.5 block py-0.5 text-base font-semibold leading-snug text-foreground sm:text-lg ${row.href ? "transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" : ""}`}
        >
          {row.value}
        </Value>
      </span>
      {row.copy && (
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${row.label}`}
          className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted opacity-100 transition-[opacity,color,background-color] hover:bg-primary/10 hover:text-primary focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-primary sm:opacity-0 sm:group-hover:opacity-100"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <m.svg key="ok" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600" aria-hidden="true">
                <path d="M5 12l5 5L20 7" />
              </m.svg>
            ) : (
              <m.svg key="cp" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="11" height="11" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </m.svg>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {copied && (
              <m.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-8 right-0 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-semibold text-background"
                role="status"
              >
                Copied
              </m.span>
            )}
          </AnimatePresence>
        </button>
      )}
    </m.li>
  );
}
