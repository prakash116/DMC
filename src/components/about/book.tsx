"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type Variants } from "framer-motion";
import { db } from "@/lib/db";

const { book } = db.about;
const EASE = [0.22, 1, 0.36, 1] as const;

export function ExploreBook() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-32" aria-labelledby="book-heading">
      {/* warm saffron wash that picks up the cover's palette */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(55%_60%_at_28%_50%,rgba(214,150,60,0.22),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_50%_at_80%_30%,rgba(114,47,55,0.1),transparent_70%)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20 lg:px-8">
        <Book3D reduce={!!reduce} />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
          className="text-center lg:text-left"
        >
          <motion.p variants={fade(reduce)} className="font-display text-lg italic text-deep-burgundy">
            {book.label}
          </motion.p>
          <motion.h2 id="book-heading" variants={fade(reduce)} className="mt-2 font-display text-4xl font-medium leading-[1.08] text-foreground sm:text-5xl">
            {book.heading}
          </motion.h2>
          <motion.p variants={fade(reduce)} className="mt-2 text-sm font-medium tracking-[0.08em] text-muted">
            {book.subtitle} · by {book.author}
          </motion.p>

          {book.paragraphs.map((p) => (
            <motion.p key={p.slice(0, 20)} variants={fade(reduce)} className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base lg:mx-0">
              {p}
            </motion.p>
          ))}

          <motion.div variants={fade(reduce)} className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <a
              href={book.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-deep-burgundy px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_var(--deep-burgundy)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy"
            >
              {book.cta.label}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
            <span className="flex items-center gap-2 text-sm text-muted">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="text-deep-burgundy" aria-hidden="true">
                <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {book.note}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* CSS-3D book: cover + spine + page block, tilts toward the cursor and the cover lifts open on hover */
function Book3D({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  // resting pose shows the spine + page depth; cursor adds to it
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -14]), { stiffness: 160, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [6, 38]), { stiffness: 160, damping: 20 });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType === "touch") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="group relative mx-auto w-60 sm:w-70 lg:w-80"
      style={{ perspective: 1400 }}
    >
      {/* floating idle motion */}
      <motion.div
        animate={reduce ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative aspect-680/1000">
          {/* page block (slightly inset, cream) */}
          <div
            className="absolute inset-y-0.75 left-1.5 right-0 rounded-r-md bg-[#f3ead9] shadow-[inset_-6px_0_10px_-6px_rgba(0,0,0,0.25)]"
            style={{ transform: "translateZ(-14px)" }}
            aria-hidden="true"
          />
          {/* spine */}
          <div
            className="absolute inset-y-0 left-0 w-7 origin-left rounded-l-md bg-[#8a3a1f]"
            style={{ transform: "rotateY(-90deg) translateX(-14px)" }}
            aria-hidden="true"
          />
          {/* back cover */}
          <div className="absolute inset-0 rounded-md bg-[#7a2f18]" style={{ transform: "translateZ(-28px)" }} aria-hidden="true" />
          {/* front cover: opens a little on hover */}
          <div
            className="absolute inset-0 origin-left overflow-hidden rounded-r-md shadow-[0_30px_50px_-20px_rgba(60,30,10,0.55)] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] transform-3d group-hover:transform-[rotateY(-26deg)]"
          >
            <Image src={book.image} alt={`${book.heading.replace("Discover ", "")} book cover`} fill sizes="320px" className="object-cover" />
            {/* spine crease + gloss */}
            <span className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-linear-to-r from-black/35 to-transparent" aria-hidden="true" />
            <span className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent" aria-hidden="true" />
          </div>
        </motion.div>
      </motion.div>

      {/* ground shadow */}
      <div className="mx-auto mt-4 h-5 w-3/4 rounded-full bg-[#5a2a10]/25 blur-md" aria-hidden="true" />
    </motion.div>
  );
}

function fade(reduce: boolean | null): Variants {
  return {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  };
}
