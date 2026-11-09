"use client";

import { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { m, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { db } from "@/lib/db";
import { useRichVisuals } from "@/hooks/use-rich-visuals";

const FeaturesBackdrop = dynamic(() => import("./features-backdrop").then((m) => m.FeaturesBackdrop), { ssr: false });

const { features, featuresIntro } = db.home;

export function Features() {
  const reduce = useReducedMotion();
  const rich = useRichVisuals();

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28" aria-labelledby="features-heading">
      {/* Three.js foam bubbles drifting behind the cards */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {rich && <FeaturesBackdrop reducedMotion={!!reduce} />}
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="features-heading" className="font-display text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            {featuresIntro.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{featuresIntro.text}</p>
        </div>

        <m.ul
          className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        >
          {features.map((f) => (
            <FeatureCard key={f.title} feature={f} reduce={!!reduce} />
          ))}
        </m.ul>
      </div>
    </section>
  );
}

type Feature = (typeof features)[number];

function FeatureCard({ feature, reduce }: { feature: Feature; reduce: boolean }) {
  const ref = useRef<HTMLLIElement>(null);

  // Pointer-driven tilt + spotlight
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const spot = useMotionTemplate`radial-gradient(260px circle at calc(${mx} * 100%) calc(${my} * 100%), rgba(114,47,55,0.14), transparent 70%)`;

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType === "touch") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px);
    my.set(py);
    ry.set((px - 0.5) * 10);
    rx.set((0.5 - py) * 10);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <m.li
      ref={ref}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="glass group relative flex flex-col rounded-3xl p-7 will-change-transform sm:p-8"
    >
      <m.span className="pointer-events-none absolute inset-0 rounded-3xl" style={{ background: spot }} aria-hidden="true" />

      <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-deep-burgundy text-mocha-cream shadow-[0_10px_24px_-10px_var(--deep-burgundy)]">
        <span
          aria-hidden="true"
          className="block h-8 w-8 bg-current"
          style={{
            maskImage: `url(/icons/${feature.icon}.svg)`,
            WebkitMaskImage: `url(/icons/${feature.icon}.svg)`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      </span>

      <h3 className="relative mt-6 font-display text-2xl font-semibold leading-snug text-foreground sm:text-[1.7rem]">
        {feature.title}
      </h3>
      <p className="relative mt-3 flex-1 text-[15px] leading-relaxed text-muted">{feature.text}</p>

      <Link
        href={feature.href}
        className="relative mt-4 inline-flex w-fit items-center gap-2 py-2.5 text-sm font-semibold text-deep-burgundy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep-burgundy"
      >
        {feature.linkLabel}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </m.li>
  );
}
