"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { db } from "@/lib/db";
import { canUseRichVisuals, useRichVisuals } from "@/hooks/use-rich-visuals";

import { DriveReveal } from "./drive-reveal";

const WashScene = dynamic(() => import("./wash-scene").then((m) => m.WashScene), { ssr: false });

const KEY = "tdm-preloader-seen";
const T_TOTAL = 4.0;
const T_HANDOFF = 3.1; // 3D car has left the bay → overlay fades, 2D car drives across the page
const DRIVE_MS = 1800;
const LABELS = ["Rolling in…", "Washing with devotion…", "Green light — shining out.", "Ready."];

const noop = () => () => {};
// first visit of the session on a desktop-class device (phones skip the WebGL intro entirely).
// SSR renders the overlay, but CSS keeps it hidden unless the inline head script set html.tdm-intro.
const useFirstVisit = () =>
  useSyncExternalStore(
    noop,
    () => {
      try {
        return sessionStorage.getItem(KEY) !== "1" && canUseRichVisuals();
      } catch {
        return false;
      }
    },
    () => true,
  );

export function Preloader() {
  const first = useFirstVisit();
  const reduce = useReducedMotion();
  // hydration renders with the server snapshot (first = true), so the WebGL scene waits for a client-side check
  const rich = useRichVisuals({ idle: false });
  const [open, setOpen] = useState(true);
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [driving, setDriving] = useState(false); // 2D car crossing the home page
  const show = first && open;

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    setOpen(false);
  }, []);

  // Lock scroll while the loader is up; hard timeout as a safety net
  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(finish, reduce ? 1200 : (T_TOTAL + 0.6) * 1000);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [show, reduce, finish]);

  const endDrive = useCallback(() => setDriving(false), []);

  // the real overlay is up: retire the static first-paint cover
  useEffect(() => {
    document.documentElement.classList.add("tdm-ready");
  }, []);

  // Once the car is out of the wash, hand off: close the overlay and run the drive-across
  const handoff = useRef(false);
  const onProgress = useCallback(
    (p: number, ph: number) => {
      setProgress((v) => (Math.abs(v - p) > 0.01 ? p : v));
      setPhase((v) => (v === ph ? v : ph));
      if (p * T_TOTAL >= T_HANDOFF && !handoff.current) {
        handoff.current = true;
        setDriving(true);
        finish();
      }
    },
    [finish],
  );

  return (
    <>
      {/* Full-size car drives across and "runs open" the site behind it */}
      {driving && !reduce && <DriveReveal duration={DRIVE_MS / 1000} onDone={endDrive} />}


    <AnimatePresence>
      {show && (
        <m.div
          key="preloader"
          role="status"
          aria-live="polite"
          aria-label="Loading The Detailing Monk"
          initial={{ opacity: 1 }}
          // hidden instantly under the drive-reveal curtain (same look), faded otherwise (skip / reduced motion)
          exit={{ opacity: 0, transition: { duration: driving ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] } }}
          className="tdm-preloader fixed inset-0 z-100 flex flex-col bg-background text-foreground"
        >
          {/* backdrop glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_60%,rgba(183,168,154,0.45),transparent_70%)]" aria-hidden="true" />

          {/* top: logo */}
          <div className="relative flex items-center justify-center pt-10 sm:pt-14">
            <m.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <Image src="/logo/logo-light.png" alt="" width={96} height={50} loading="eager" className="h-11 w-auto sm:h-14" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-semibold sm:text-2xl">{db.site.name}</span>
                <span className="mt-1 text-[10px] tracking-[0.18em] text-muted">{db.site.tagline}</span>
              </span>
            </m.div>
          </div>

          {/* middle: scene */}
          <div className="relative min-h-0 flex-1">
            {!reduce && rich && <WashScene onProgress={onProgress} />}
          </div>

          {/* bottom: status + progress + skip */}
          <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-4 px-6 pb-10 sm:pb-14">
            <AnimatePresence mode="wait" initial={false}>
              <m.p
                key={LABELS[phase]}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="font-display text-lg italic text-deep-burgundy sm:text-xl"
              >
                {reduce ? "Loading…" : LABELS[phase]}
              </m.p>
            </AnimatePresence>
            <div className="h-1 w-full overflow-hidden rounded-full bg-cosmic-latte/50" aria-hidden="true">
              <m.div
                className="h-full rounded-full bg-deep-burgundy"
                animate={{ width: `${Math.round((reduce ? 1 : progress) * 100)}%` }}
                transition={{ duration: 0.2, ease: "linear" }}
              />
            </div>
            <button
              type="button"
              onClick={finish}
              className="text-xs font-semibold tracking-wide text-muted underline-offset-4 transition-colors hover:text-deep-burgundy hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep-burgundy"
            >
              Skip intro
            </button>
          </div>
        </m.div>
      )}
    </AnimatePresence>
    </>
  );
}
