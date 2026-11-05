"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { db } from "@/lib/db";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";

const { nav, contact } = db.site;

export function Header() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const compact = scrolled && !open;
  const underlineTarget = hovered ?? pathname;

  return (
    <>
      <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-4 lg:px-6">
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-3 sm:px-5 lg:px-6 transition-[height,background-color,box-shadow] duration-300 ${
            compact ? "glass-strong h-14 lg:h-16" : "glass h-16 lg:h-18"
          }`}
        >
          <Logo compact={compact} />

          {/* Desktop nav */}
          <LayoutGroup id="primary-nav">
            <nav aria-label="Primary" className="hidden xl:block">
              <ul className="flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
                {nav.map((item) => {
                  const active = pathname === item.href;
                  const showLine = underlineTarget === item.href;
                  return (
                    <li key={item.href} className="relative">
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onMouseEnter={() => setHovered(item.href)}
                        onFocus={() => setHovered(item.href)}
                        onBlur={() => setHovered(null)}
                        className={`relative block whitespace-nowrap px-3.5 py-2 text-[15px] font-medium tracking-wide transition-colors duration-200 focus-visible:outline-none ${
                          active ? "text-primary" : "text-foreground/80 hover:text-foreground"
                        }`}
                      >
                        {item.label}
                        {showLine && (
                          <motion.span
                            layoutId="nav-underline"
                            aria-hidden="true"
                            className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-primary"
                            transition={
                              reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36, mass: 0.6 }
                            }
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </LayoutGroup>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book a slot on WhatsApp"
              className="hidden items-center gap-2 whitespace-nowrap rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_6px_20px_-8px_var(--deep-burgundy)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_var(--deep-burgundy)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline-flex"
            >
              <WhatsAppIcon />
              Book a slot
            </a>

            <ThemeToggle className="hidden xl:grid" />

            {/* Hamburger → X */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="glass relative z-50 grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary xl:hidden"
            >
              <span className="relative block h-3.5 w-4.5" aria-hidden="true">
                <span
                  className={`absolute left-0 top-0 h-[1.8px] w-full rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${
                    open ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-[1.8px] w-full rounded-full bg-current transition-[opacity,transform] duration-200 ${
                    open ? "scale-x-0 opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-3 h-[1.8px] w-full rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${
                    open ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={close} pathname={pathname} />
    </>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}
