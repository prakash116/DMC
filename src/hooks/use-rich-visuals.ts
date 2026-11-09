"use client";

import { useEffect, useState } from "react";

/*
 * WebGL scenes (three.js ≈ 240 KB gz + continuous GPU work) are a desktop enhancement.
 * They load only on large, mouse-driven screens without reduced-motion / data-saver,
 * and only once the browser is idle — phones get the static CSS backdrops instead.
 */
import { RICH_QUERY } from "@/lib/rich-query";

export { RICH_QUERY };

export function canUseRichVisuals() {
  if (typeof window === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia(RICH_QUERY).matches && !conn?.saveData;
}

export function useRichVisuals({ idle = true }: { idle?: boolean } = {}) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!canUseRichVisuals()) return;
    if (!idle) {
      const t = setTimeout(() => setOk(true), 0);
      return () => clearTimeout(t);
    }
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setOk(true), { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setOk(true), 600);
    return () => clearTimeout(t);
  }, [idle]);
  return ok;
}
