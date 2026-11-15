"use client";

import { LazyMotion } from "framer-motion";

/* `m.*` components render immediately; their animation/layout/drag features arrive in a separate chunk */
const loadFeatures = () => import("@/lib/motion-features").then((r) => r.default);

// Filter out internal Three.js deprecation warning from @react-three/fiber
if (typeof window !== "undefined") {
  const origWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock: This module has been deprecated")) return;
    origWarn.apply(console, args);
  };
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
