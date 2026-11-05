"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";

const PageHeroScene = dynamic(() => import("./page-hero-scene").then((m) => m.PageHeroScene), { ssr: false });

type Props = {
  title: string;
  eyebrow?: string;
  text?: string;
  crumbs?: { label: string; href: string }[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function PageHero({ title, eyebrow, text, crumbs = [] }: Props) {
  const reduce = useReducedMotion();

  return (
    <section className="relative -mt-19 flex min-h-[50svh] items-end overflow-hidden bg-cosmic-latte text-foreground lg:-mt-21" aria-labelledby="page-title">
      <div className="absolute inset-0" aria-hidden="true">
        <PageHeroScene reducedMotion={!!reduce} />
        {/* readability + blend into the page */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(232,220,198,0.35)_0%,rgba(232,220,198,0)_40%,rgba(232,220,198,0.45)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-background" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-35 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 lg:pt-40">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
        >
          {crumbs.length > 0 && (
            <motion.nav variants={fade(reduce)} aria-label="Breadcrumb" className="mb-5 text-sm">
              <ol className="flex flex-wrap items-center gap-2 text-[#2b1d1f]/65">
                {crumbs.map((c) => (
                  <li key={c.href} className="flex items-center gap-2">
                    <Link href={c.href} className="transition-colors hover:text-deep-burgundy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-deep-burgundy">
                      {c.label}
                    </Link>
                    <span className="h-1 w-1 rotate-45 bg-deep-burgundy" aria-hidden="true" />
                  </li>
                ))}
                <li className="font-medium text-[#2b1d1f]" aria-current="page">{title}</li>
              </ol>
            </motion.nav>
          )}
          {eyebrow && (
            <motion.p variants={fade(reduce)} className="font-display text-lg italic text-deep-burgundy">
              {eyebrow}
            </motion.p>
          )}
          <motion.h1
            id="page-title"
            variants={fade(reduce)}
            className="mt-1 font-display text-5xl font-medium leading-[1.02] text-[#2b1d1f] sm:text-6xl lg:text-[5.5rem]"
          >
            {title}
          </motion.h1>
          {text && (
            <motion.p variants={fade(reduce)} className="mt-5 max-w-2xl text-base leading-relaxed text-[#2b1d1f]/80 sm:text-lg">
              {text}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function fade(reduce: boolean | null) {
  return {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
  };
}
