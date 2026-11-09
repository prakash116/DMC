"use client";

import Image from "next/image";
import { animate, m, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ScrollWords } from "@/components/ui/scroll-words";
import { useEffect, useRef } from "react";
import { db } from "@/lib/db";
import { fade } from "@/components/services/motion";

const { intro, logos, logoDir } = db.brands;
const orbit = logos.filter((_, i) => i % 3 === 0).slice(0, 8);
const films = logos.filter((l) => l.group === "films").length;

export function BrandsIntro() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28" aria-labelledby="brands-intro-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:px-8">
        {/* count badge */}
        <m.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto grid aspect-square w-full max-w-xs place-items-center sm:max-w-sm"
        >
          <span className="absolute inset-0 rounded-full border border-primary/20" aria-hidden="true" />
          <span className="absolute inset-6 rounded-full border border-dashed border-primary/25 motion-safe:animate-[spin_40s_linear_infinite]" aria-hidden="true" />
          <span className="absolute inset-12 rounded-full bg-surface-muted/70" aria-hidden="true" />
          {/* logos orbiting on the outer ring, each counter-rotating to stay upright */}
          <div className="brand-orbit absolute inset-0 [--orbit-r:158px] sm:[--orbit-r:190px]" aria-hidden="true">
            {orbit.map((l, i) => {
              const a = (i / orbit.length) * 360;
              return (
                <span key={l.file} className="absolute left-1/2 top-1/2 -ml-6 -mt-6 h-12 w-12 sm:-ml-7 sm:-mt-7 sm:h-14 sm:w-14" style={{ transform: `rotate(${a}deg) translateY(calc(-1 * var(--orbit-r))) rotate(${-a}deg)` }}>
                  <span className="brand-orbit-item grid h-full w-full place-items-center overflow-hidden rounded-full bg-white p-1.5 shadow-[0_10px_24px_-12px_rgba(114,47,55,0.55)] ring-1 ring-border/70">
                    <Image src={`${logoDir}/${l.file}.webp`} alt="" width={56} height={42} className="h-full w-full object-contain mix-blend-multiply" />
                  </span>
                </span>
              );
            })}
          </div>
          <div className="relative text-center">
            <p className="font-display text-8xl font-semibold leading-none text-primary sm:text-9xl">
              <Counter to={logos.length} />
            </p>
            <p className="mt-2 text-sm font-medium tracking-[0.18em] text-foreground/75 uppercase">Brands we use</p>
            <p className="mt-4 text-xs text-foreground/70">
              {logos.length - films} care & equipment · {films} protection films
            </p>
          </div>
        </m.div>

        {/* copy */}
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          <m.p variants={fade(reduce)} className="font-display text-lg italic text-primary">
            {intro.label}
          </m.p>
          <m.h2
            id="brands-intro-heading"
            variants={fade(reduce)}
            className="mt-3 font-display text-3xl font-medium leading-snug text-foreground sm:text-4xl lg:text-[2.6rem]"
          >
            <ScrollWords text={`“${intro.quote}”`} />
          </m.h2>
          <m.p variants={fade(reduce)} className="mt-7 max-w-2xl border-l-2 border-primary/40 pl-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            {intro.text}
          </m.p>
        </m.div>
      </div>
    </section>
  );
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();
  const v = useMotionValue(reduce ? to : 0);
  const text = useTransform(v, (n) => String(Math.round(n)));
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(v, to, { duration: 1.4, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [inView, reduce, to, v]);
  return <m.span ref={ref}>{text}</m.span>;
}
