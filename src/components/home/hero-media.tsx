"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { m, LayoutGroup } from "framer-motion";

export type MediaSlide = { id: string; title: string; video: string; poster: string };

type Props = {
  slides: MediaSlide[];
  active: number;
  dir: 1 | -1;
  duration: number; // ms per slide, drives the countdown ring on the next circle
  paused: boolean;
  reduce: boolean;
  onPick: (i: number) => void;
};

const SPRING = { type: "spring", stiffness: 140, damping: 22, mass: 0.9 } as const;

/*
 * Square stage on top, the remaining slides as circles below.
 * Each slide is ONE element (shared layoutId): on change the next circle flies up, spins and opens into
 * the square, while the outgoing square folds back down into the last circle.
 */
export function HeroMedia({ slides, active, dir, duration, paused, reduce, onPick }: Props) {
  const n = slides.length;
  const current = slides[active];
  const queue = Array.from({ length: n - 1 }, (_, k) => (active + 1 + k) % n);
  const layout = reduce ? { duration: 0 } : SPRING;
  // no entrance spin on first paint, only when slides actually change
  const [seen, setSeen] = useState({ active, changed: false });
  if (seen.active !== active) setSeen({ active, changed: true });
  const videoOn = useIdleVideo();
  const still = reduce || (!seen.changed && seen.active === active);

  return (
    <LayoutGroup id="hero-media">
      <div className="flex h-full w-full flex-col items-center justify-center gap-5 sm:gap-6">
        {/* Square stage */}
        <div className="relative aspect-square w-full max-w-[min(100%,46vh,30rem)] lg:max-w-[min(100%,52vh,32rem)]">
          {/* frame + travelling light around the stage */}
          <div className="absolute -inset-3 rounded-[2.4rem] border border-deep-burgundy/15" aria-hidden="true" />
          <div className="hero-halo absolute -inset-0.75 rounded-[31px]" aria-hidden="true" />
          <m.div
            key={current.id}
            layoutId={`hero-media-${current.id}`}
            transition={{ layout, rotate: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
            initial={still ? false : { rotate: dir * -20 }}
            animate={{ rotate: 0 }}
            style={{ borderRadius: 28 }}
            className="absolute inset-0 overflow-hidden bg-[#2b1d1f] shadow-[0_30px_60px_-24px_rgba(43,29,31,0.6)]"
          >
            {/* optimized poster paints first (LCP); the mp4 is attached once the page is idle */}
            <Image src={current.poster} alt="" fill loading={active === 0 ? "eager" : "lazy"} fetchPriority={active === 0 ? "high" : "auto"} sizes="(min-width: 1024px) 32rem, 90vw" className="object-cover" />
            {videoOn && (
              <video key={current.video} src={current.video} autoPlay muted loop playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#2b1d1f]/55 via-transparent to-transparent" />
            <m.p
              key={`${current.id}-label`}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="absolute bottom-4 left-5 right-5 font-display text-lg italic text-mocha-cream sm:text-xl"
            >
              {String(active + 1).padStart(2, "0")} — {current.title}
            </m.p>
          </m.div>
        </div>

        {/* Circles: up next */}
        <ul className="flex items-center justify-center gap-4 sm:gap-6" aria-label="Up next">
          {queue.map((i, pos) => {
            const s = slides[i];
            const isNext = pos === 0;
            return (
              <li key={`slot-${pos}`} className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-22 lg:w-22">
                {/* countdown ring around the circle that plays next */}
                {isNext && (
                  <svg className="absolute -inset-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+0.75rem)] -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                    <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(43,29,31,0.15)" strokeWidth="2.5" />
                    <m.circle
                      key={`${s.id}-${paused}`}
                      cx="50"
                      cy="50"
                      r="47"
                      fill="none"
                      stroke="#722F37"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: paused ? 0 : 1 }}
                      transition={{ duration: paused ? 0.2 : duration / 1000, ease: "linear" }}
                    />
                  </svg>
                )}
                <m.button
                  key={s.id}
                  type="button"
                  layoutId={`hero-media-${s.id}`}
                  transition={{ layout, rotate: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
                  initial={still ? false : { rotate: -140 }}
                  animate={{ rotate: 0 }}
                  whileHover={reduce ? undefined : { scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPick(i)}
                  aria-label={`Play: ${s.title}`}
                  style={{ borderRadius: 999 }}
                  className="absolute inset-0 overflow-hidden border-2 border-mocha-cream bg-[#2b1d1f] shadow-[0_10px_24px_-10px_rgba(43,29,31,0.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep-burgundy"
                >
                  <Image src={s.poster} alt="" fill sizes="88px" className="scale-110 object-cover" draggable={false} />
                  <span className="absolute inset-0 grid place-items-center bg-[#2b1d1f]/25 text-white">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </m.button>
              </li>
            );
          })}
        </ul>
      </div>
    </LayoutGroup>
  );
}

/* attach hero videos only after load + idle, and never with data-saver on */
function useIdleVideo() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    let idleId = 0;
    let t = 0;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const arm = () => {
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => setOn(true), { timeout: 3000 });
      else t = window.setTimeout(() => setOn(true), 1500);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      window.removeEventListener("load", arm);
      if (idleId) w.cancelIdleCallback?.(idleId);
      clearTimeout(t);
    };
  }, []);
  return on;
}
