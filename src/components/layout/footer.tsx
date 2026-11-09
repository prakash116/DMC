"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { db } from "@/lib/db";
import { useRichVisuals } from "@/hooks/use-rich-visuals";

const FooterCar = dynamic(() => import("./footer-car").then((m) => m.FooterCar), { ssr: false });

const { name, tagline, ethos, contact, social, nav, footerLinks, copyright } = db.site;
const quickLinks = [...nav, ...footerLinks];
const EASE = [0.22, 1, 0.36, 1] as const;

export function Footer() {
  const reduce = useReducedMotion();
  const rich = useRichVisuals();
  const fade: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <footer className="relative overflow-hidden bg-mocha-cream/60 text-foreground dark:bg-surface" aria-labelledby="footer-heading">
      {/* 3D blueprint car backdrop */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {rich && <FooterCar reducedMotion={!!reduce} />}
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-mocha-cream/70 to-transparent dark:from-background/80" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        {/* CTA band */}
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col items-start gap-6 pb-2 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <m.p variants={fade} className="font-display text-lg italic text-primary">
              {ethos}
            </m.p>
            <m.h2 id="footer-heading" variants={fade} className="mt-2 font-display text-4xl font-medium leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
              Give your car the care it deserves.
            </m.h2>
          </div>
          <m.div variants={fade} className="flex flex-wrap gap-3">
            <a
              href={contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-deep-burgundy px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_var(--deep-burgundy)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy"
            >
              <WhatsAppIcon /> Book on WhatsApp
            </a>
            <a
              href={contact.phoneHref}
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:text-deep-burgundy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy"
            >
              Call {contact.phone}
            </a>
          </m.div>
        </m.div>

        {/* Columns */}
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="glass-strong my-10 grid gap-10 rounded-3xl px-6 py-9 sm:my-12 sm:grid-cols-2 sm:px-9 sm:py-11 lg:grid-cols-[1.3fr_1fr_1.1fr] lg:gap-12 lg:px-12"
        >
          {/* Brand */}
          <m.div variants={fade}>
            <Link href="/" className="inline-flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep-burgundy">
              <Image src="/logo/logo-light.png" alt="" width={96} height={50} className="h-12 w-auto" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-semibold text-foreground">{name}</span>
                <span className="mt-1 text-[11px] tracking-[0.16em] text-muted">{tagline}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              A car detailing studio in Sector 11, Rohini — washes, interior care, polishing, ceramic & graphene coatings and PPF, done by hand with devotion.
            </p>
            <ul className="mt-6 flex gap-3" aria-label="Social media">
              {[
                { href: social.instagram, label: "Instagram", icon: <InstagramIcon /> },
                { href: social.facebook, label: "Facebook", icon: <FacebookIcon /> },
                { href: social.youtube, label: "YouTube", icon: <YouTubeIcon /> },
              ].map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="glass grid h-10 w-10 place-items-center rounded-full text-primary transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy"
                  >
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </m.div>

          {/* Contact */}
          <m.div variants={fade}>
            <h3 className="font-display text-xl font-semibold text-foreground">Contact</h3>
            <ul className="mt-5 space-y-3.5 text-sm">
              <li>
                <a href={contact.phoneHref} className="group inline-flex items-start gap-3 text-foreground/80 hover:text-deep-burgundy">
                  <PhoneIcon />
                  <span><span className="block text-xs text-muted">Call us</span>{contact.phone}</span>
                </a>
              </li>
              <li>
                <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="group inline-flex items-start gap-3 text-foreground/80 hover:text-deep-burgundy">
                  <WhatsAppIcon />
                  <span><span className="block text-xs text-muted">WhatsApp</span>{contact.whatsapp.replace(/^91/, "")}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="group inline-flex items-start gap-3 text-foreground/80 hover:text-deep-burgundy">
                  <MailIcon />
                  <span><span className="block text-xs text-muted">Email us</span>{contact.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-foreground/80">
                <PinIcon />
                <span><span className="block text-xs text-muted">Address</span>{contact.address.line1},<br />{contact.address.line2}</span>
              </li>
              <li className="flex items-start gap-3 text-foreground/80">
                <ClockIcon />
                <span><span className="block text-xs text-muted">Open timing</span>{contact.hours}<br />{contact.closed} is off</span>
              </li>
            </ul>
          </m.div>

          {/* Quick links */}
          <m.nav variants={fade} aria-label="Footer">
            <h3 className="font-display text-xl font-semibold text-foreground">Quick links</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-0.5 text-sm">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex min-h-10 items-center gap-2 text-foreground/80 transition-colors hover:text-deep-burgundy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep-burgundy"
                  >
                    <span className="h-px w-0 bg-deep-burgundy transition-[width] duration-300 group-hover:w-4" aria-hidden="true" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </m.nav>
        </m.div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-4 pt-2 text-xs text-muted sm:flex-row sm:justify-between">
          <p>{copyright}</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:text-deep-burgundy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy"
          >
            Back to top
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}

const ic = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, className: "mt-0.5 shrink-0 text-primary" };
function PhoneIcon() { return <svg {...ic}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.8 2z" /></svg>; }
function MailIcon() { return <svg {...ic}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>; }
function PinIcon() { return <svg {...ic}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>; }
function ClockIcon() { return <svg {...ic}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>; }
function WhatsAppIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="mt-0.5 shrink-0"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" /></svg>; }
function InstagramIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>; }
function FacebookIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8z" /></svg>; }
function YouTubeIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.5 7.2a2.8 2.8 0 0 0-2-2C18.8 4.8 12 4.8 12 4.8s-6.8 0-8.5.4a2.8 2.8 0 0 0-2 2C1 8.9 1 12 1 12s0 3.1.5 4.8a2.8 2.8 0 0 0 2 2c1.7.4 8.5.4 8.5.4s6.8 0 8.5-.4a2.8 2.8 0 0 0 2-2c.5-1.7.5-4.8.5-4.8s0-3.1-.5-4.8zM9.8 15.1V8.9l5.7 3.1z" /></svg>; }
