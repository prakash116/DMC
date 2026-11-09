import type { Variants } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;

export function fade(reduce: boolean | null): Variants {
  return {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
  };
}

/* "Detailed Wash (Vacuum + Foam/Rinse-less Wash + Tyre Care)" → name + detail */
export function splitService(s: string) {
  const m = s.match(/^([^(]+?)\s*\((.+?)\)\s*(.*)$/);
  if (!m) return { name: s, detail: "" };
  return { name: m[1].trim(), detail: [m[2], m[3]].filter(Boolean).join(" ").trim() };
}
