"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface ComparisonItem {
  id: string;
  title: string;
  category: string;
  beforeDesc: string;
  afterDesc: string;
  beforeImage: string;
  afterImage: string;
}

const COMPARISONS: ComparisonItem[] = [
  {
    id: "paint-correction",
    title: "Paint Correction & Swirl Mark Removal",
    category: "Exterior Compounding",
    beforeDesc: "Swirl marks, spider webbing, micro-scratches and dull paint caused by improper washing.",
    afterDesc: "90%+ defect removal with high-precision machine compounding, revealing deep mirror gloss.",
    beforeImage: "/images/home/detailing-touch.jpg",
    afterImage: "/images/home/paint-care.jpg",
  },
  {
    id: "ceramic-gloss",
    title: "Ceramic Coating Gloss & Hydrophobic Shield",
    category: "Paint Protection",
    beforeDesc: "Unprotected clear coat prone to bird droppings, acid rain, UV oxidation, and hard water spots.",
    afterDesc: "Multi-year 9H ceramic shield producing candy gloss, rich colour depth, and extreme water beading.",
    beforeImage: "/images/services/polishing-restoration-serv.jpg",
    afterImage: "/videos/posters/video-image8.jpg",
  },
  {
    id: "interior-restoration",
    title: "Deep Interior Cleaning & Steam Sanitization",
    category: "Cabin Care",
    beforeDesc: "Dust, grime, and food stains embedded deep into seats, carpets, and air conditioning vents.",
    afterDesc: "140°C high-temp steam sanitization, stain extraction, and leather conditioning for a factory-fresh cabin.",
    beforeImage: "/images/services/interior-care-serv.jpg",
    afterImage: "/images/home/interior-care.jpg",
  },
  {
    id: "detailed-foam-wash",
    title: "Decontamination & Foam Wash",
    category: "Wash & Seal",
    beforeDesc: "Heavy traffic film, road tar, and brake dust coating panels and alloy wheels.",
    afterDesc: "Scratch-free two-bucket pH-neutral foam wash, surface decontamination, and satin tyre dressing.",
    beforeImage: "/images/services/foam-detailed-washes-serv.jpg",
    afterImage: "/images/home/exterior-care.jpg",
  },
];

export function BeforeAfterSection() {
  const [selectedId, setSelectedId] = useState(COMPARISONS[0].id);
  const active = COMPARISONS.find((c) => c.id === selectedId) || COMPARISONS[0];

  return (
    <section id="before-after" className="scroll-mt-28 py-16 sm:py-20 lg:py-24" aria-labelledby="before-after-heading">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-deep-burgundy/25 bg-deep-burgundy/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-deep-burgundy">
            Real Transformations
          </span>
          <h2 id="before-after-heading" className="mt-3 font-display text-4xl font-medium leading-[1.08] text-foreground sm:text-5xl">
            Before & After Showcase
          </h2>
          <p className="mt-3 text-base text-muted sm:text-lg">
            Slide horizontally or tap below to reveal the precision and depth of our detailing rituals.
          </p>
        </div>

        {/* Category selector pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {COMPARISONS.map((c) => {
            const isSelected = c.id === selectedId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  isSelected
                    ? "bg-deep-burgundy text-white shadow-md shadow-deep-burgundy/30"
                    : "border border-border/80 bg-surface/70 text-foreground/80 hover:border-deep-burgundy/40 hover:text-deep-burgundy"
                }`}
              >
                {c.title.split("&")[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Interactive Comparison Slider */}
        <div className="mt-8 mx-auto max-w-4xl">
          <BeforeAfterSlider key={active.id} item={active} />
        </div>

        {/* Details & WhatsApp booking CTA */}
        <div className="mt-8 mx-auto max-w-4xl grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4.5">
            <span className="inline-block rounded-md bg-red-500/15 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-red-600">
              Before
            </span>
            <p className="mt-2 text-sm text-foreground/80">{active.beforeDesc}</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4.5">
            <span className="inline-block rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
              After (The Monk Finish)
            </span>
            <p className="mt-2 text-sm text-foreground/80">{active.afterDesc}</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href={`https://wa.me/918826966825?text=${encodeURIComponent(
              `Hi Detailing Monk, I saw your Before & After for "${active.title}". I'd like to get my car detailed.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#128c7e] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#128c7e]/30 transition-transform hover:-translate-y-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
            </svg>
            Book This Transformation on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function BeforeAfterSlider({ item }: { item: ComparisonItem }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percent = Math.round((clampedX / rect.width) * 100);
    setSliderPos(Math.max(2, Math.min(98, percent)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Fallback
    }
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      isDragging.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Fallback
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="group relative aspect-16/10 w-full select-none overflow-hidden rounded-3xl border border-border/80 bg-neutral-900 shadow-2xl cursor-ew-resize touch-none"
      >
        {/* After Image (Background Layer) */}
        <div className="absolute inset-0">
          <Image
            src={item.afterImage}
            alt={`After: ${item.title}`}
            fill
            priority
            sizes="(min-width: 1024px) 850px, 100vw"
            className="object-cover"
          />
          <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-black/65 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-emerald-400 shadow-sm">
            AFTER
          </span>
        </div>

        {/* Before Image (Foreground Layer with ClipPath) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <Image
            src={item.beforeImage}
            alt={`Before: ${item.title}`}
            fill
            priority
            sizes="(min-width: 1024px) 850px, 100vw"
            className="object-cover"
          />
          <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-black/65 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-red-400 shadow-sm">
            BEFORE
          </span>
        </div>

        {/* Divider Line & Circular Grip Handle */}
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Vertical dividing line */}
          <div className="absolute inset-y-0 -left-0.5 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)]" />

          {/* Central Handle */}
          <div className="absolute top-1/2 -left-5 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-deep-burgundy text-white shadow-xl transition-transform group-hover:scale-110">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
              <polyline points="9 18 3 12 9 6" />
            </svg>
          </div>
        </div>

        {/* Transparent Range Input Overlay for Universal Native Touch & Mouse Support */}
        <input
          type="range"
          min="2"
          max="98"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          aria-label={`Comparison slider for ${item.title}`}
          className="absolute inset-0 h-full w-full opacity-0 cursor-ew-resize z-20"
        />

        {/* Drag Hint Pill */}
        <div className="pointer-events-none absolute top-4 inset-x-0 flex justify-center z-10">
          <span className="rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1 text-[11px] font-semibold text-white/90 shadow-md">
            Drag slider left ⇄ right
          </span>
        </div>
      </div>

      {/* Quick Preset Buttons (Before / 50-50 / After) */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSliderPos(95)}
          className="rounded-full border border-border/80 bg-surface/80 px-3 py-1 text-xs font-medium text-foreground hover:bg-surface hover:text-deep-burgundy transition-colors"
        >
          View Full Before
        </button>
        <button
          type="button"
          onClick={() => setSliderPos(50)}
          className="rounded-full border border-border/80 bg-surface/80 px-3 py-1 text-xs font-medium text-foreground hover:bg-surface hover:text-deep-burgundy transition-colors"
        >
          50 / 50 Split
        </button>
        <button
          type="button"
          onClick={() => setSliderPos(5)}
          className="rounded-full border border-border/80 bg-surface/80 px-3 py-1 text-xs font-medium text-foreground hover:bg-surface hover:text-deep-burgundy transition-colors"
        >
          View Full After
        </button>
      </div>
    </div>
  );
}
