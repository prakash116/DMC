"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, m, useReducedMotion } from "framer-motion";
import { db } from "@/lib/db";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";

const { nav, contact } = db.site;
// Logo already links to home, so desktop nav focuses on primary pages to keep header elegant and uncongested
const desktopNav = nav.filter((item) => item.href !== "/");

export function Header() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const compact = scrolled && !open;
  const underlineTarget = hovered ?? pathname;

  return (
    <>
      <header className="sticky top-0 z-50 w-full px-2.5 pt-2.5 sm:px-4 sm:pt-3 lg:px-6">
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-3 sm:px-5 lg:px-6 transition-[height,background-color,box-shadow] duration-300 ${
            compact ? "glass-strong h-14 lg:h-16 shadow-md" : "glass h-15 lg:h-17"
          }`}
        >
          {/* Brand Logo */}
          <div className="shrink-0">
            <Logo compact={compact} />
          </div>

          {/* Desktop Nav - Clean, spacious & uncongested */}
          <LayoutGroup id="primary-nav">
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-0.5 xl:gap-1.5" onMouseLeave={() => setHovered(null)}>
                {desktopNav.map((item) => {
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
                        className={`relative block whitespace-nowrap px-2.5 py-1.5 text-[13.5px] xl:text-[14.5px] font-medium tracking-normal transition-colors duration-200 focus-visible:outline-none ${
                          active ? "text-primary font-semibold" : "text-foreground/80 hover:text-foreground"
                        }`}
                      >
                        {item.label}
                        {showLine && (
                          <m.span
                            layoutId="nav-underline"
                            aria-hidden="true"
                            className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-primary"
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

          {/* Right Action Block */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* WhatsApp CTA - Icon on mobile, full pill on tablet/desktop */}
            <a
              href={contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#128c7e] p-2 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#0d6e63] hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128c7e]"
            >
              <WhatsAppIcon />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Book Now Button - Hidden on mobile header to prevent clutter/overflow, prominent on tablet & desktop */}
            <Link
              href="/#booking-section"
              className="hidden sm:inline-flex items-center justify-center whitespace-nowrap rounded-full bg-deep-burgundy px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-[0_6px_20px_-8px_var(--deep-burgundy)] transition-all hover:bg-[#582229] hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy"
            >
              Book Now
            </Link>

            {/* Theme Toggle on desktop */}
            <ThemeToggle className="hidden lg:grid" />

            {/* Mobile Hamburger button */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="glass relative z-50 grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}
