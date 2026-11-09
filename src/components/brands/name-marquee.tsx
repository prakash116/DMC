"use client";

import { m, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { db } from "@/lib/db";

const names = db.brands.logos.map((l) => l.name);
const half = Math.ceil(names.length / 2);
const rows = [names.slice(0, half), names.slice(half)];

/* Two big type rows sliding opposite ways; they lean into the scroll direction with scroll speed */
export function BrandsNameMarquee() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 30 });
  const skew = useTransform(velocity, [-2500, 0, 2500], reduce ? [0, 0, 0] : [8, 0, -8]);

  return (
    <section aria-hidden="true" className="relative overflow-hidden border-y border-border/70 py-10 sm:py-14">
      <m.div style={{ skewX: skew }} className="flex flex-col gap-3 sm:gap-5 mask-[linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        {rows.map((row, r) => (
          <div key={r} className="marquee overflow-hidden" style={{ "--marquee-duration": `${row.length * 6}s` } as React.CSSProperties}>
            <ul className={`marquee-track flex w-max items-center ${r === 1 ? "is-reverse" : ""}`}>
              {[0, 1].map((copy) =>
                row.map((n, i) => (
                  <li key={`${copy}-${n}`} className="flex items-center">
                    <span
                      className={`whitespace-nowrap px-5 font-display text-5xl font-semibold leading-none sm:px-8 sm:text-7xl lg:text-8xl ${
                        (i + r) % 2 === 0 ? "text-primary/85" : "text-transparent [-webkit-text-stroke:1px_var(--primary)]"
                      }`}
                    >
                      {n}
                    </span>
                    <span className="h-2.5 w-2.5 rotate-45 bg-[#e9a970] sm:h-3 sm:w-3" />
                  </li>
                )),
              )}
            </ul>
          </div>
        ))}
      </m.div>
    </section>
  );
}
