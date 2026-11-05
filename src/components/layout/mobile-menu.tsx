"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { db } from "@/lib/db";
import { ThemeToggle } from "./theme-toggle";

type Props = {
  open: boolean;
  onClose: () => void;
  pathname: string;
};

const { nav, contact } = db.site;

export function MobileMenu({ open, onClose, pathname }: Props) {
  const reduce = useReducedMotion();

  // Lock scroll + close on Escape while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Plain slide-down: clip-path circle() reveals misrender on several mobile browsers
  const panel = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: -24 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -16 },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          {...panel}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong fixed inset-x-0 top-0 z-40 flex h-dvh flex-col overflow-y-auto rounded-none border-0 text-foreground xl:hidden"
        >
          {/* spacer = ticker (36px) + header bar (76px) so links start below the bar */}
          <div className="h-28 shrink-0" />

          <nav className="flex flex-1 flex-col justify-start px-7 pt-4 sm:justify-center sm:pt-0">
            <ul className="flex flex-col gap-1">
              {nav.map((item, i) => {
                const active = pathname === item.href;
                return (
                  <motion.li
                    key={item.href}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={{ delay: 0.18 + i * 0.055, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-baseline gap-4 border-b border-border/70 py-3 font-display text-[1.75rem] leading-none tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:py-3.5 sm:text-[2rem] ${
                        active ? "text-primary" : "text-foreground hover:text-primary"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${
                          active ? "bg-primary" : "bg-transparent group-hover:bg-accent"
                        }`}
                        aria-hidden="true"
                      />
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="glass mx-4 mb-4 flex items-center justify-between gap-3 rounded-2xl px-5 py-4"
          >
            <div className="flex min-w-0 flex-col gap-0.5 text-sm">
              <a href={contact.phoneHref} className="font-medium text-foreground hover:text-primary">
                {contact.phone}
              </a>
              <span className="text-xs text-muted">Tue–Sun, 10 AM–8 PM</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform active:scale-95"
              >
                WhatsApp
              </a>
              <ThemeToggle />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
