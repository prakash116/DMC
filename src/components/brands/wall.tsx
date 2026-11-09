"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, m, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { db } from "@/lib/db";
import { EASE } from "@/components/services/motion";

const { logos, logoDir, groups } = db.brands;
type GroupId = (typeof groups)[number]["id"];

export function BrandsWall() {
  const reduce = useReducedMotion();
  const [group, setGroupState] = useState<GroupId>("all");
  // layout tracking (a measure on every render) only switches on once the visitor actually filters
  const [filtered, setFiltered] = useState(false);
  const setGroup = (g: GroupId) => {
    setFiltered(true);
    setGroupState(g);
  };
  const tilt = useFinePointer();
  const shown = group === "all" ? logos : logos.filter((l) => l.group === group);
  const count = (id: string) => (id === "all" ? logos.length : logos.filter((l) => l.group === id).length);

  return (
    <section id="brand-wall" className="relative scroll-mt-28 bg-surface-muted/50 py-20 sm:py-24 lg:py-28" aria-labelledby="brand-wall-heading">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="brand-wall-heading" className="font-display text-4xl font-medium leading-[1.08] sm:text-5xl">
            {db.brands.banner.title}
          </h2>

          {/* filter */}
          <LayoutGroup id="brand-filter">
            <div role="tablist" aria-label="Filter brands" className="glass-strong -mx-1 flex gap-1 overflow-x-auto rounded-2xl p-1.5 [scrollbar-width:none]">
              {groups.map((g) => {
                const on = g.id === group;
                return (
                  <button
                    key={g.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setGroup(g.id)}
                    className={`relative flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      on ? "text-primary-foreground" : "text-foreground/75 hover:text-foreground"
                    }`}
                  >
                    {on && (
                      <m.span
                        layoutId="brand-filter-pill"
                        className="absolute inset-0 rounded-xl bg-primary"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    <span className="relative">{g.label}</span>
                    <span className={`relative rounded-full px-1.5 text-[11px] font-semibold ${on ? "bg-white/20" : "bg-foreground/8"}`}>{count(g.id)}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        <m.ul layout={!reduce && filtered} className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map((l, i) => (
              <m.li
                key={l.file}
                layout={!reduce && filtered}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, rotateX: -35, transformPerspective: 900 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : (i % 6) * 0.07 }}
              >
                {tilt ? <Tile logo={l} reduce={!!reduce} /> : <StaticTile logo={l} />}
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      </div>
    </section>
  );
}

type Logo = (typeof logos)[number];

/* Logo tile: tilts toward the pointer in 3D, with a soft spotlight that follows it */
function Tile({ logo: l, reduce }: { logo: Logo; reduce: boolean }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 18, mass: 0.5 };
  const rx = useSpring(useTransform(my, [0, 1], reduce ? [0, 0] : [10, -10]), spring);
  const ry = useSpring(useTransform(mx, [0, 1], reduce ? [0, 0] : [-12, 12]), spring);
  const glow = useMotionTemplate`radial-gradient(220px circle at ${useTransform(mx, (v) => v * 100)}% ${useTransform(my, (v) => v * 100)}%, rgba(114,47,55,0.14), transparent 65%)`;

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <m.figure
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border/70 shadow-[0_14px_30px_-24px_rgba(114,47,55,0.6)] transition-shadow duration-500 will-change-transform hover:shadow-[0_30px_50px_-24px_rgba(114,47,55,0.6)] hover:ring-deep-burgundy/30"
    >
      <m.span aria-hidden="true" style={{ background: glow }} className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* polish sheen on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 z-10 w-1/2 -translate-x-full skew-x-[-18deg] bg-linear-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 group-hover:translate-x-[320%]"
      />
      <div className="grid aspect-4/3 place-items-center p-4 sm:p-5">
        <Image
          src={`${logoDir}/${l.file}.webp`}
          alt={l.name}
          width={200}
          height={150}
          sizes="(min-width: 1280px) 180px, (min-width: 640px) 25vw, 45vw"
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <figcaption className="relative flex items-center justify-between gap-2 border-t border-[#2b1d1f]/8 px-3.5 py-2.5 text-xs font-medium text-[#2b1d1f]/75">
        <span className="truncate transition-colors group-hover:text-deep-burgundy">{l.name}</span>
        {l.group === "films" && (
          <span className="shrink-0 rounded-full bg-deep-burgundy/10 px-1.5 py-0.5 text-[11px] font-semibold text-deep-burgundy">Films</span>
        )}
      </figcaption>
    </m.figure>
  );
}

/* touch devices can't tilt: same tile without the per-tile springs (much cheaper to hydrate) */
function StaticTile({ logo: l }: { logo: Logo }) {
  return (
    <figure className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border/70 shadow-[0_14px_30px_-24px_rgba(114,47,55,0.6)]">
      <div className="grid aspect-4/3 place-items-center p-4 sm:p-5">
        <Image src={`${logoDir}/${l.file}.webp`} alt={l.name} width={200} height={150} sizes="(min-width: 1280px) 180px, (min-width: 640px) 25vw, 45vw" className="h-full w-full object-contain mix-blend-multiply" />
      </div>
      <figcaption className="relative flex items-center justify-between gap-2 border-t border-[#2b1d1f]/8 px-3.5 py-2.5 text-xs font-medium text-[#2b1d1f]/75">
        <span className="truncate">{l.name}</span>
        {l.group === "films" && <span className="shrink-0 rounded-full bg-deep-burgundy/10 px-1.5 py-0.5 text-[11px] font-semibold text-deep-burgundy">Films</span>}
      </figcaption>
    </figure>
  );
}

function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFine(window.matchMedia("(pointer: fine) and (hover: hover)").matches), 0);
    return () => clearTimeout(t);
  }, []);
  return fine;
}
