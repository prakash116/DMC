"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, m, useReducedMotion, type PanInfo } from "framer-motion";
import { db } from "@/lib/db";
import { useRichVisuals } from "@/hooks/use-rich-visuals";
import { HeroMedia } from "./hero-media";

const HeroBackdrop = dynamic(() => import("./hero-backdrop").then((m) => m.HeroBackdrop), { ssr: false });

const { hero } = db.home;
const slides = hero.slides;
const DURATION = hero.slideDuration;
const SWIPE_PX = 50;

export function Hero() {
  const reduce = useReducedMotion();
  const rich = useRichVisuals();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next: number, d: 1 | -1) => {
    setDir(d);
    setIndex((next + slides.length) % slides.length);
  }, []);
  const next = useCallback(() => go(index + 1, 1), [go, index]);
  const prev = useCallback(() => go(index - 1, -1), [go, index]);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(next, DURATION);
    return () => clearTimeout(t);
  }, [index, paused, next]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_PX) next();
    else if (info.offset.x > SWIPE_PX) prev();
  };

  const slide = slides[index];
  const textVariants = reduce
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: (d: number) => ({ opacity: 0, y: 18 * d }),
        center: { opacity: 1, y: 0 },
        exit: (d: number) => ({ opacity: 0, y: -18 * d }),
      };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="relative -mt-19 overflow-hidden bg-cosmic-latte text-foreground lg:-mt-21"
    >
      {/* Backdrop: shader silk texture, then a soft burgundy glow where the active card sits, fading into the page below */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0">
          {rich && <HeroBackdrop reducedMotion={!!reduce} />}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_72%_55%,rgba(114,47,55,0.2),transparent_70%)] lg:bg-[radial-gradient(45%_60%_at_74%_50%,rgba(114,47,55,0.24),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background" />
      </div>

      <div className="relative mx-auto grid min-h-svh w-full max-w-7xl grid-rows-[auto_1fr_auto] px-5 pt-26 sm:px-6 lg:min-h-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:grid-rows-[1fr_auto] lg:items-center lg:gap-8 lg:px-8 lg:pt-28">
        {/* Copy */}
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:row-start-1 lg:text-left">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-deep-burgundy/25 bg-deep-burgundy/10 px-3 py-1 text-xs font-semibold text-deep-burgundy">
              <span className="h-2 w-2 rounded-full bg-deep-burgundy animate-pulse" />
              Studio in Sector 11, Rohini
            </span>
            <span className="text-xs font-medium text-[#2b1d1f]/70 hidden sm:inline">|</span>
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] font-medium tracking-[0.12em] text-deep-burgundy lg:justify-start">
              {hero.badge.map((w, i) => (
                <span key={w} className="flex items-center gap-2 whitespace-nowrap">
                  {w}
                  {i < hero.badge.length - 1 && <span className="h-1 w-1 rounded-full bg-deep-burgundy/60" aria-hidden="true" />}
                </span>
              ))}
            </p>
          </div>

          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <m.div
              key={slide.id}
              custom={dir}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
            >
              <h1 className="font-display text-[2.4rem] font-medium leading-[1.08] text-[#2b1d1f] sm:text-5xl lg:text-[4rem]">
                {slide.title}
              </h1>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#2b1d1f]/80 sm:text-lg lg:mx-0">{slide.text}</p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5 lg:justify-start">
                <a
                  href={slide.primary.href}
                  target={slide.primary.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#0f7d70] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(18,140,126,0.8)] transition-all hover:-translate-y-0.5 hover:bg-[#075e54] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f7d70]"
                >
                  <WhatsAppHeroIcon />
                  {slide.primary.label}
                </a>
                <a
                  href="#booking-section"
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-deep-burgundy px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_var(--deep-burgundy)] transition-all hover:-translate-y-0.5 hover:bg-[#5b232a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Book Now
                </a>
              </div>
            </m.div>
          </AnimatePresence>
        </div>

        {/* Square stage + circular up-next reel */}
        <m.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.05}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          onHoverStart={() => setPaused(true)}
          onHoverEnd={() => setPaused(false)}
          className="relative w-full min-w-0 cursor-grab touch-pan-y pt-8 active:cursor-grabbing lg:row-start-1 lg:pt-0"
        >
          <HeroMedia
            slides={slides}
            active={index}
            dir={dir}
            duration={DURATION}
            paused={paused}
            reduce={!!reduce}
            onPick={(i) => go(i, 1)}
          />
        </m.div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 py-6 lg:col-span-2 lg:row-start-2 lg:pb-10 lg:pt-2">
          <div className="flex min-w-0 items-center gap-4">
            <span className="shrink-0 font-display text-sm text-[#2b1d1f]/70">
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <span className="hidden h-px w-8 bg-[#2b1d1f]/25 sm:block" aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={slide.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="hidden truncate text-sm font-medium text-[#2b1d1f]/80 sm:block"
              >
                {slide.title}
              </m.span>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
            {slides.map((s, i) => {
              const active = i === index;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`${i + 1}. ${s.title}`}
                  onClick={() => go(i, i > index ? 1 : -1)}
                  className={`group relative flex h-6 items-center transition-[width] duration-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy ${
                    active ? "w-12" : "w-6"
                  }`}
                >
                  {/* 24px tap target; the visible bar is the thin line inside */}
                  <span className={`relative block h-1.5 w-full overflow-hidden rounded-full bg-[#2b1d1f]/20 transition-colors ${active ? "" : "group-hover:bg-[#2b1d1f]/45"}`}>
  {active && (
                      <m.span
                        key={`${s.id}-${paused}`}
                        className="absolute inset-y-0 left-0 rounded-full bg-deep-burgundy"
                        initial={{ width: "0%" }}
                        animate={{ width: paused ? undefined : "100%" }}
                        transition={{ duration: DURATION / 1000, ease: "linear" }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <ArrowButton dir="prev" onClick={prev} />
            <ArrowButton dir="next" onClick={next} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowButton({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
      className="grid h-11 w-11 place-items-center rounded-full border border-[#2b1d1f]/25 bg-mocha-cream/50 text-[#2b1d1f] backdrop-blur-md transition-colors hover:border-deep-burgundy hover:text-deep-burgundy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dir === "prev" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  );
}

function WhatsAppHeroIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}
