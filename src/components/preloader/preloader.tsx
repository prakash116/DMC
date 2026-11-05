"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { db } from "@/lib/db";

import { CarSvg } from "./car-svg";

const WashScene = dynamic(() => import("./wash-scene").then((m) => m.WashScene), { ssr: false });

const KEY = "tdm-preloader-seen";
const T_TOTAL = 4.0;
const T_HANDOFF = 3.1; // 3D car has left the bay → overlay fades, 2D car drives across the page
const DRIVE_MS = 1700;
const LABELS = ["Rolling in…", "Washing with devotion…", "Green light — shining out.", "Ready."];

const noop = () => () => {};
// true until the client confirms this session has already seen the loader
const useFirstVisit = () =>
  useSyncExternalStore(
    noop,
    () => {
      try {
        return sessionStorage.getItem(KEY) !== "1";
      } catch {
        return true;
      }
    },
    () => true,
  );

export function Preloader() {
  const first = useFirstVisit();
  const reduce = useReducedMotion();
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
        setTimeout(() => setDriving(false), DRIVE_MS);
      }
    },
    [finish],
  );

  return (
    <>
      {/* 2D car drives across the home page right after the wash, then slips away top-left where the cursor lives */}
      <AnimatePresence>
        {driving && !reduce && (
          <motion.div
            key="drive"
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-150"
          >
            <motion.div
              className="absolute left-0 top-[58%] w-[min(42vw,260px)] drop-shadow-[0_18px_30px_rgba(114,47,55,0.35)]"
              initial={{ x: "-110%", y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: ["-110%", "40vw", "90vw", "110vw"],
                y: [0, 0, 0, 0],
                scale: [1, 1, 0.9, 0.7],
                opacity: [1, 1, 1, 0],
              }}
              transition={{ duration: DRIVE_MS / 1000, times: [0, 0.45, 0.85, 1], ease: ["easeOut", "linear", "easeIn", "easeIn"] }}
            >
              <CarSvg className="h-auto w-full" />
              {/* speed lines */}
              <motion.span
                className="absolute right-full top-1/2 mr-2 h-px w-16 bg-deep-burgundy/40"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: [0, 0.8, 0.8, 0], scaleX: [0, 1, 1, 0] }}
                transition={{ duration: DRIVE_MS / 1000, times: [0, 0.3, 0.8, 1] }}
                style={{ transformOrigin: "right" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          role="status"
          aria-live="polite"
          aria-label="Loading The Detailing Monk"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-100 flex flex-col bg-background text-foreground"
        >
          {/* backdrop glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_60%,rgba(183,168,154,0.45),transparent_70%)]" aria-hidden="true" />

          {/* top: logo */}
          <div className="relative flex items-center justify-center pt-10 sm:pt-14">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <Image src="/logo/logo-light.png" alt="" width={96} height={50} priority className="h-11 w-auto sm:h-14" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-semibold sm:text-2xl">{db.site.name}</span>
                <span className="mt-1 text-[10px] tracking-[0.18em] text-muted">{db.site.tagline}</span>
              </span>
            </motion.div>
          </div>

          {/* middle: scene */}
          <div className="relative min-h-0 flex-1">
            {!reduce && (
              <WashScene onProgress={onProgress} />
            )}
          </div>

          {/* bottom: status + progress + skip */}
          <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-4 px-6 pb-10 sm:pb-14">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={LABELS[phase]}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="font-display text-lg italic text-deep-burgundy sm:text-xl"
              >
                {reduce ? "Loading…" : LABELS[phase]}
              </motion.p>
            </AnimatePresence>
            <div className="h-1 w-full overflow-hidden rounded-full bg-cosmic-latte/50" aria-hidden="true">
              <motion.div
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
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
