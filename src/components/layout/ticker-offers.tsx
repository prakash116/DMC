"use client";

import Link from "next/link";
import { useLiveOffers } from "@/hooks/use-live-offers";
import { hoursBannerLine } from "@/lib/offers";

/* Scrolling offer lines for the top banner: live offers from the offers config + the opening-hours line */
export function TickerOffers() {
  const lines = [...useLiveOffers().map((o) => ({ text: o.text, href: o.href })), hoursBannerLine];
  // ~9s per line keeps the pace readable regardless of how many are configured
  const duration = `${Math.max(24, lines.length * 9)}s`;

  return (
    <div
      className="ticker relative min-w-0 flex-1 overflow-hidden"
      style={{ "--ticker-duration": duration } as React.CSSProperties}
      aria-label="Current offers"
    >
      {/* fade edges */}
      <span className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-deep-burgundy to-transparent" aria-hidden="true" />
      <span className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-deep-burgundy to-transparent" aria-hidden="true" />

      <ul className="ticker-track flex w-max items-center">
        {[0, 1].map((copy) =>
          lines.map((line, i) => (
            <li key={`${copy}-${i}`} aria-hidden={copy === 1 || undefined} className="flex items-center">
              <Link
                href={line.href}
                tabIndex={copy === 1 ? -1 : 0}
                className="block whitespace-nowrap py-2 text-[13px] font-medium tracking-wide transition-colors hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mocha-cream"
              >
                {line.text}
              </Link>
              <span className="mx-5 inline-block h-1.5 w-1.5 rotate-45 bg-cosmic-latte" aria-hidden="true" />
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
