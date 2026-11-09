"use client";

import { LazyMotion } from "framer-motion";

/* `m.*` components render immediately; their animation/layout/drag features arrive in a separate chunk */
const loadFeatures = () => import("@/lib/motion-features").then((r) => r.default);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
