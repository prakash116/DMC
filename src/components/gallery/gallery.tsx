"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, m, useReducedMotion } from "framer-motion";
import { db } from "@/lib/db";
import { EASE, fade } from "@/components/services/motion";
import { Lightbox, type LightboxItem } from "./lightbox";

const { images, videos } = db.gallery;

/* categories come straight from the photo alt text ("Car Interior Care" → "Interior Care") */
const cat = (alt: string) => alt.replace(/^Car\s+/, "");
const CATS = ["All", ...Array.from(new Set(images.map((i) => cat(i.alt))))];

const ITEMS: LightboxItem[] = [
  ...images.map((i) => ({ kind: "image" as const, key: `p${i.id}`, src: i.full, thumb: i.thumb, alt: i.alt, w: i.w, h: i.h })),
  ...videos.map((v) => ({ kind: "video" as const, key: `v${v.id}`, src: v.src, thumb: v.poster, alt: `Detailing video ${v.id}`, w: 400, h: 524 })),
];

export function Gallery() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState("All");
  const [index, setIndex] = useState<number | null>(null);
  const [origin, setOrigin] = useState<string | null>(null);

  const shown = useMemo(() => images.filter((i) => filter === "All" || cat(i.alt) === filter), [filter]);
  const openAt = useCallback((key: string) => {
    setOrigin(key);
    setIndex(ITEMS.findIndex((it) => it.key === key));
  }, []);
  const close = useCallback(() => setIndex(null), []);

  return (
    <LayoutGroup id="gallery">
      {/* quick jump */}
      <div className="mx-auto mt-14 flex max-w-7xl justify-center px-5 sm:px-6 lg:px-8">
        <nav aria-label="Gallery sections" className="glass-strong flex gap-1 rounded-full p-1.5">
          {[
            { href: "#photos", label: "Image Gallery", n: images.length },
            { href: "#videos", label: "Video Gallery", n: videos.length },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {l.label}
              <span className="rounded-full bg-foreground/8 px-1.5 text-[11px] font-semibold">{l.n}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* ---------- Photos ---------- */}
      <section id="photos" className="scroll-mt-28 py-16 sm:py-20" aria-labelledby="photos-heading">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <m.h2
              id="photos-heading"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fade(reduce)}
              className="font-display text-4xl font-medium leading-[1.08] sm:text-5xl"
            >
              Image Gallery
            </m.h2>
            <div role="tablist" aria-label="Filter photos" className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
              {CATS.map((c) => {
                const on = c === filter;
                const n = c === "All" ? images.length : images.filter((i) => cat(i.alt) === c).length;
                return (
                  <button
                    key={c}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setFilter(c)}
                    className={`relative flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      on ? "border-primary text-primary-foreground" : "border-border text-foreground/75 hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {on && (
                      <m.span
                        layoutId="gallery-filter"
                        className="absolute inset-0 rounded-full bg-primary"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    <span className="relative">{c}</span>
                    <span className={`relative text-[11px] font-semibold ${on ? "text-white/75" : "text-muted"}`}>{n}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* bento grid: portrait photos take two rows, landscape ones two columns */}
          <m.ul layout={!reduce} className="mt-10 grid grid-flow-dense auto-rows-[clamp(120px,15vw,210px)] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence initial={false} mode="popLayout">
              {shown.map((img, i) => {
                const wide = img.w > img.h;
                return (
                  <m.li
                    key={img.id}
                    layout={!reduce}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.94 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : (i % 4) * 0.08 }}
                    className={`row-span-2 ${wide ? "col-span-2" : ""}`}
                  >
                    <Tile
                      layoutKey={`p${img.id}`}
                      src={img.full}
                      alt={img.alt}
                      sizes={wide ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"}
                      onOpen={openAt}
                    />
                  </m.li>
                );
              })}
            </AnimatePresence>
          </m.ul>
        </div>
      </section>

      {/* ---------- Videos ---------- */}
      <section id="videos" className="scroll-mt-28 bg-[#1f1517] py-20 text-mocha-cream sm:py-24" aria-labelledby="videos-heading">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <m.h2
              id="videos-heading"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fade(reduce)}
              className="font-display text-4xl font-medium leading-[1.08] sm:text-5xl"
            >
              Video Gallery
            </m.h2>
            <p className="text-sm text-mocha-cream/60">Hover to preview · tap to play with sound</p>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {videos.map((v, i) => (
              <m.li
                key={v.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 50, rotate: i % 2 ? 2 : -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: EASE, delay: reduce ? 0 : (i % 4) * 0.09 }}
              >
                <VideoCard id={v.id} src={v.src} poster={v.poster} onOpen={openAt} />
              </m.li>
            ))}
          </ul>
        </div>
      </section>

      <Lightbox items={ITEMS} index={index} origin={origin} onIndex={setIndex} onClose={close} />
    </LayoutGroup>
  );
}

function Tile({ layoutKey, src, alt, sizes, onOpen }: { layoutKey: string; src: string; alt: string; sizes: string; onOpen: (k: string) => void }) {
  return (
    <m.button
      type="button"
      layoutId={`tile-${layoutKey}`}
      onClick={() => onOpen(layoutKey)}
      aria-label={`Open photo: ${alt}`}
      style={{ borderRadius: 18 }}
      className="group relative block h-full w-full overflow-hidden bg-cosmic-latte shadow-[0_20px_40px_-26px_rgba(114,47,55,0.6)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110" />
      <span className="absolute inset-0 bg-linear-to-t from-[#2b1d1f]/75 via-[#2b1d1f]/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span className="absolute inset-x-4 bottom-4 flex translate-y-3 items-center justify-between gap-2 text-left text-mocha-cream opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <span className="font-display text-lg italic leading-tight">{alt}</span>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mocha-cream/20 backdrop-blur">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </span>
      </span>
    </m.button>
  );
}

/* poster until hovered; the mp4 is only attached on hover so the page doesn't pull ~38 MB up front */
function VideoCard({ id, src, poster, onOpen }: { id: number; src: string; poster: string; onOpen: (k: string) => void }) {
  const [preview, setPreview] = useState(false);
  const vid = useRef<HTMLVideoElement>(null);
  const key = `v${id}`;
  return (
    <m.button
      type="button"
      layoutId={`tile-${key}`}
      onClick={() => onOpen(key)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setPreview(true)}
      onPointerLeave={() => setPreview(false)}
      aria-label={`Play video ${id}`}
      style={{ borderRadius: 18 }}
      className="group relative block aspect-400/524 w-full overflow-hidden bg-black text-left focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#e9a970]"
    >
      <Image src={poster} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
      {preview && <video ref={vid} src={src} muted loop playsInline autoPlay preload="auto" className="absolute inset-0 h-full w-full object-cover" />}
      <span className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/10" />
      {/* play button with a pulsing ring */}
      <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center transition-[opacity,transform] duration-500 group-hover:scale-90 group-hover:opacity-0">
        <span className="absolute inset-0 rounded-full border border-mocha-cream/60 motion-safe:animate-ping" />
        <span className="grid h-full w-full place-items-center rounded-full bg-mocha-cream/20 text-white backdrop-blur-md">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
        </span>
      </span>
      <span className="absolute inset-x-4 bottom-4 flex items-center justify-between font-display text-sm tracking-widest text-mocha-cream/85">
        <span>{String(id).padStart(2, "0")}</span>
        <span className="text-[11px] font-sans font-semibold tracking-wide text-[#e9a970] opacity-0 transition-opacity group-hover:opacity-100">Play ▸</span>
      </span>
    </m.button>
  );
}
