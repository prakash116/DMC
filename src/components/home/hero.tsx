"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { db } from "@/lib/db";

const HeroScene = dynamic(() => import("./hero-scene").then((m) => m.HeroScene), { ssr: false });
const HeroBackdrop = dynamic(() => import("./hero-backdrop").then((m) => m.HeroBackdrop), { ssr: false });

const { hero } = db.home;
const slides = hero.slides;
const DURATION = hero.slideDuration;
const SWIPE_PX = 50;

export function Hero() {
  const reduce = useReducedMotion();
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
          <HeroBackdrop reducedMotion={!!reduce} />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_72%_55%,rgba(114,47,55,0.2),transparent_70%)] lg:bg-[radial-gradient(45%_60%_at_74%_50%,rgba(114,47,55,0.24),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background" />
      </div>

      <div className="relative mx-auto grid min-h-svh w-full max-w-7xl grid-rows-[auto_1fr_auto] px-5 pt-26 sm:px-6 lg:min-h-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:grid-rows-[1fr_auto] lg:items-center lg:gap-8 lg:px-8 lg:pt-28">
        {/* Copy */}
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:row-start-1 lg:text-left">
          <p className="mb-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] font-medium tracking-[0.12em] text-deep-burgundy lg:justify-start">
            {hero.badge.map((w, i) => (
              <span key={w} className="flex items-center gap-3 whitespace-nowrap">
                {w}
                {i < hero.badge.length - 1 && <span className="h-1 w-1 rounded-full bg-deep-burgundy/60" aria-hidden="true" />}
              </span>
            ))}
          </p>

          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={slide.id}
              custom={dir}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
            >
              <h1 className="font-display text-[2.5rem] font-medium leading-[1.05] text-[#2b1d1f] sm:text-6xl lg:text-[4.25rem]">
                {slide.title}
              </h1>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[#2b1d1f]/80 sm:text-lg lg:mx-0">{slide.text}</p>
              <div className="mt-8 flex flex-nowrap items-center justify-center gap-3 lg:justify-start">
                <a
                  href={slide.primary.href}
                  target={slide.primary.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="whitespace-nowrap rounded-full bg-deep-burgundy px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_var(--deep-burgundy)] transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy sm:px-6"
                >
                  {slide.primary.label}
                </a>
                <Link
                  href={slide.secondary.href}
                  className="whitespace-nowrap rounded-full border border-[#2b1d1f]/25 bg-mocha-cream/50 px-5 py-3 text-sm font-semibold text-[#2b1d1f] backdrop-blur-md transition-colors hover:border-deep-burgundy hover:text-deep-burgundy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy sm:px-6"
                >
                  {slide.secondary.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3D coverflow */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.05}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          onHoverStart={() => setPaused(true)}
          onHoverEnd={() => setPaused(false)}
          className="relative h-[46vh] min-h-80 w-full min-w-0 cursor-grab touch-pan-y active:cursor-grabbing sm:h-[52vh] lg:row-start-1 lg:h-[68vh] lg:max-h-160 lg:min-h-125"
          aria-hidden="true"
        >
          <HeroScene slides={slides} active={index} dir={dir} />
        </motion.div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 py-6 lg:col-span-2 lg:row-start-2 lg:pb-10 lg:pt-2">
          <div className="flex min-w-0 items-center gap-4">
            <span className="shrink-0 font-display text-sm text-[#2b1d1f]/70">
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <span className="hidden h-px w-8 bg-[#2b1d1f]/25 sm:block" aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={slide.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="hidden truncate text-sm font-medium text-[#2b1d1f]/80 sm:block"
              >
                {slide.title}
              </motion.span>
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
                  className={`relative h-1.5 overflow-hidden rounded-full bg-[#2b1d1f]/20 transition-[width] duration-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep-burgundy ${
                    active ? "w-12" : "w-4 hover:bg-[#2b1d1f]/45"
                  }`}
                >
                  {active && (
                    <motion.span
                      key={`${s.id}-${paused}`}
                      className="absolute inset-y-0 left-0 rounded-full bg-deep-burgundy"
                      initial={{ width: "0%" }}
                      animate={{ width: paused ? undefined : "100%" }}
                      transition={{ duration: DURATION / 1000, ease: "linear" }}
                    />
                  )}
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
