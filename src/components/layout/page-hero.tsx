"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useRichVisuals } from "@/hooks/use-rich-visuals";

const PageHeroScene = dynamic(() => import("./page-hero-scene").then((m) => m.PageHeroScene), { ssr: false });

type Props = {
  title: string;
  eyebrow?: string;
  text?: string;
  crumbs?: { label: string; href: string }[];
};

/*
 * Entrance is pure CSS (.hero-rise): it starts with the server HTML, so the page title — usually the
 * LCP element — paints immediately instead of waiting for JS hydration to un-hide it.
 */
export function PageHero({ title, eyebrow, text, crumbs = [] }: Props) {
  const reduce = useReducedMotion();
  const rich = useRichVisuals();
  const delay = (i: number) => ({ animationDelay: `${120 + i * 90}ms` });

  return (
    <section className="relative -mt-19 flex min-h-[50svh] items-end overflow-hidden bg-cosmic-latte text-foreground lg:-mt-21" aria-labelledby="page-title">
      <div className="absolute inset-0" aria-hidden="true">
        {rich && <PageHeroScene reducedMotion={!!reduce} />}
        {/* soft static backdrop for phones / before the WebGL scene loads */}
        <div className="absolute inset-0 bg-[radial-gradient(55%_70%_at_80%_20%,rgba(114,47,55,0.14),transparent_70%),radial-gradient(45%_60%_at_10%_90%,rgba(250,246,239,0.6),transparent_70%)]" />
        {/* readability + blend into the page */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(232,220,198,0.35)_0%,rgba(232,220,198,0)_40%,rgba(232,220,198,0.45)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-background" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-35 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 lg:pt-40">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="hero-rise mb-5 text-sm" style={delay(0)}>
            <ol className="flex flex-wrap items-center gap-2 text-[#2b1d1f]/65">
              {crumbs.map((c) => (
                <li key={c.href} className="flex items-center gap-2">
                  <Link href={c.href} className="inline-block py-1.5 transition-colors hover:text-deep-burgundy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep-burgundy">
                    {c.label}
                  </Link>
                  <span className="h-1 w-1 rotate-45 bg-deep-burgundy" aria-hidden="true" />
                </li>
              ))}
              <li className="font-medium text-[#2b1d1f]" aria-current="page">
                {title}
              </li>
            </ol>
          </nav>
        )}
        {eyebrow && (
          <p className="hero-rise font-display text-lg italic text-deep-burgundy" style={delay(1)}>
            {eyebrow}
          </p>
        )}
        <h1 id="page-title" className="hero-rise mt-1 font-display text-5xl font-medium leading-[1.02] text-[#2b1d1f] sm:text-6xl lg:text-[5.5rem]" style={delay(2)}>
          {title}
        </h1>
        {text && (
          <p className="hero-rise mt-5 max-w-2xl text-base leading-relaxed text-[#2b1d1f]/80 sm:text-lg" style={delay(3)}>
            {text}
          </p>
        )}
      </div>
    </section>
  );
}
