"use client";

import { useEffect, useState } from "react";
import { animate, m, useMotionValue, useMotionTemplate, useTransform } from "framer-motion";
import { db } from "@/lib/db";
import { CarSvg } from "./car-svg";

/*
 * Post-preloader hand-off: a full-size coupé tears across the screen left → right.
 * A curtain (same look as the preloader) covers the site; its left edge is pinned under the car,
 * so the website is "run over" open behind the car while the curtain is still ahead of it.
 */
const EASE = [0.45, 0, 0.2, 1] as const;

export function DriveReveal({ duration = 1.8, onDone }: { duration?: number; onDone: () => void }) {
  const [vw, setVw] = useState(() => (typeof window === "undefined" ? 1280 : window.innerWidth));
  const p = useMotionValue(0);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    const c = animate(p, 1, { duration, ease: EASE, onComplete: onDone });
    return () => {
      window.removeEventListener("resize", onResize);
      c.stop();
    };
  }, [p, duration, onDone]);

  const carW = Math.min(1200, Math.max(380, vw * 0.8));
  // car's left edge travels from fully off-screen left to fully off-screen right
  const carX = useTransform(p, [0, 1], [-carW, vw + carW * 0.05]);
  // curtain edge sits under the middle of the car
  const edge = useTransform(carX, (x) => Math.max(0, x + carW * 0.52));
  const clip = useMotionTemplate`inset(0 0 0 ${edge}px)`;
  const wakeX = useTransform(edge, (e) => e - vw * 0.45);
  // subtle suspension bounce + nose lift as it accelerates
  const bob = useTransform(p, [0, 0.15, 0.3, 0.5, 0.7, 1], [0, -4, 2, -3, 1, 0]);
  const pitch = useTransform(p, [0, 0.12, 0.4, 1], [0, -1.6, 0, 0.8]);

  return (
    <div aria-hidden="true" data-drive-reveal className="pointer-events-none fixed inset-0 z-150 overflow-hidden">
      {/* curtain: still covering the site ahead of the car */}
      <m.div style={{ clipPath: clip }} className="absolute inset-0 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_60%,rgba(183,168,154,0.45),transparent_70%)]" />
        <div className="absolute inset-0 grid place-items-center">
          <p className="select-none whitespace-nowrap font-display text-[16vw] font-semibold leading-none tracking-tight text-deep-burgundy/10">
            {db.site.slogan}
          </p>
        </div>
      </m.div>

      {/* wake: a burgundy sheen washing over the freshly revealed page */}
      <m.div
        style={{ x: wakeX, width: vw * 0.45 }}
        className="absolute inset-y-0 left-0 bg-linear-to-r from-transparent via-deep-burgundy/5 to-deep-burgundy/15 mix-blend-multiply"
      />
      <m.div style={{ x: edge }} className="absolute inset-y-0 left-0 w-0.75 -translate-x-1/2 bg-linear-to-b from-transparent via-[#e9a970] to-transparent opacity-70 blur-[1px]" />

      {/* the car */}
      <m.div
        style={{ x: carX, y: bob, rotate: pitch, width: carW, ["--wheel-speed" as string]: "0.16s" }}
        className="absolute left-0 top-1/2 -translate-y-1/2 will-change-transform"
      >
        {/* speed streaks trailing behind */}
        {[0.3, 0.46, 0.62, 0.78].map((t, i) => (
          <m.span
            key={t}
            className="absolute right-[96%] h-0.5 rounded-full bg-linear-to-l from-deep-burgundy/70 to-transparent"
            style={{ top: `${t * 100}%`, width: `${30 + (i % 2) * 18}%` }}
            initial={{ opacity: 0, scaleX: 0.2 }}
            animate={{ opacity: [0, 0.9, 0.9, 0], scaleX: [0.2, 1, 1, 0.6] }}
            transition={{ duration, times: [0, 0.2, 0.8, 1], delay: i * 0.03 }}
          />
        ))}
        {/* tail-light trail */}
        <span className="absolute right-[97%] top-[49%] h-1 w-[45%] rounded-full bg-linear-to-l from-[#ff3b4e]/90 to-transparent blur-[2px]" />
        <CarSvg spin className="relative h-auto w-full drop-shadow-[0_30px_40px_rgba(43,29,31,0.45)]" />
      </m.div>
    </div>
  );
}
