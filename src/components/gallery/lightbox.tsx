"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, m, useReducedMotion, type PanInfo } from "framer-motion";

export type LightboxItem =
  | { kind: "image"; key: string; src: string; thumb: string; alt: string; w: number; h: number }
  | { kind: "video"; key: string; src: string; thumb: string; alt: string; w: number; h: number };

type Props = {
  items: LightboxItem[];
  index: number | null; // null = closed
  origin: string | null; // key of the tile it opened from (shared-layout fly-in/out)
  onIndex: (i: number) => void;
  onClose: () => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;
const noop = () => () => {};

/* Full-screen viewer: flies out of the clicked tile, arrows/swipe/keys to move, Esc to close */
export function Lightbox({ items, index, origin, onIndex, onClose }: Props) {
  const reduce = useReducedMotion();
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const [dir, setDir] = useState(1);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const item = open ? items[index] : null;

  const go = useCallback(
    (d: 1 | -1) => {
      if (index === null) return;
      setDir(d);
      onIndex((index + d + items.length) % items.length);
    },
    [index, items.length, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, go]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
    else if (info.offset.y > 120) onClose();
  };

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && item && (
        <m.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${item.alt}, ${index! + 1} of ${items.length}`}
          className="fixed inset-0 z-300 flex flex-col bg-[#140e0f]/92 text-mocha-cream backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
        >
          {/* top bar */}
          <div className="relative z-10 flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <p className="font-display text-sm tracking-widest text-mocha-cream/70">
              {String(index! + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <m.p
                key={item.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="hidden truncate font-display text-lg italic sm:block"
              >
                {item.alt}
              </m.p>
            </AnimatePresence>
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-11 w-11 place-items-center rounded-full border border-mocha-cream/20 bg-white/5 transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9a970]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* stage */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <m.div
                key={item.key}
                custom={dir}
                layoutId={item.key === origin ? `tile-${item.key}` : undefined}
                drag={item.kind === "image" ? true : "x"}
                dragSnapToOrigin
                dragElastic={0.25}
                onDragEnd={onDragEnd}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 80, scale: 0.96 }),
                  center: { opacity: 1, x: 0, scale: 1 },
                  exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -80, scale: 0.96 }),
                }}
                initial={item.key === origin ? false : "enter"}
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: EASE, layout: { type: "spring", stiffness: 260, damping: 30 } }}
                // fit inside the stage: width capped by the available height × aspect ratio
                style={{ aspectRatio: `${item.w} / ${item.h}`, width: `min(100%, calc((100svh - 13rem) * ${item.w / item.h}))`, borderRadius: 18 }}
                className="relative cursor-grab overflow-hidden bg-black shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] active:cursor-grabbing"
              >
                {item.kind === "image" ? (
                  <Image src={item.src} alt={item.alt} fill sizes="90vw" className="pointer-events-none object-contain" loading="eager" />
                ) : (
                  <video src={item.src} poster={item.thumb} controls autoPlay playsInline className="h-full w-full object-contain" />
                )}
              </m.div>
            </AnimatePresence>

            <NavButton side="prev" onClick={() => go(-1)} />
            <NavButton side="next" onClick={() => go(1)} />
          </div>

          {/* thumbnail rail */}
          <div className="relative z-10 px-4 pb-5 pt-4 sm:pb-7">
            <ul className="mx-auto flex max-w-full gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none] sm:justify-center">
              {items.map((t, i) => {
                const on = i === index;
                return (
                  <li key={t.key} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setDir(i > index! ? 1 : -1);
                        onIndex(i);
                      }}
                      aria-label={`Show ${t.alt} (${i + 1})`}
                      aria-current={on ? "true" : undefined}
                      className={`relative block h-12 w-12 overflow-hidden rounded-lg transition-[opacity,transform] duration-300 sm:h-14 sm:w-14 ${
                        on ? "scale-105 opacity-100 ring-2 ring-[#e9a970]" : "opacity-45 hover:opacity-80"
                      }`}
                    >
                      <Image src={t.thumb} alt="" fill sizes="56px" className="object-cover" />
                      {t.kind === "video" && (
                        <span className="absolute inset-0 grid place-items-center bg-black/30">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function NavButton({ side, onClick }: { side: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "prev" ? "Previous" : "Next"}
      className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-mocha-cream/20 bg-white/5 backdrop-blur transition-[background-color,transform] hover:scale-105 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9a970] sm:grid ${
        side === "prev" ? "left-5" : "right-5"
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {side === "prev" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  );
}
