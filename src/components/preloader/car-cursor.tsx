"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { CarSvg } from "./car-svg";

const noop = () => () => {};
// only on devices with a fine pointer (mouse/trackpad); touch keeps the native behaviour
const useFinePointer = () =>
  useSyncExternalStore(
    noop,
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );

export function CarCursor() {
  const fine = useFinePointer();
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine) return;
    const node = el.current;
    if (!node) return;
    document.documentElement.classList.add("car-cursor");

    let x = -100, y = -100, tx = x, ty = y, lastX = x, dir = 1, raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (tx > lastX + 2) dir = 1;
      else if (tx < lastX - 2) dir = -1;
      lastX = tx;
      node.style.opacity = "1";
    };
    const onLeave = () => (node.style.opacity = "0");
    const onDown = () => node.classList.add("is-down");
    const onUp = () => node.classList.remove("is-down");
    const tick = () => {
      x += (tx - x) * 0.28;
      y += (ty - y) * 0.28;
      node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -60%) scaleX(${dir})`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.classList.remove("car-cursor");
    };
  }, [fine]);

  if (!fine) return null;
  return (
    <div
      ref={el}
      className="car-cursor-el pointer-events-none fixed left-0 top-0 z-200 w-12 opacity-0 transition-[opacity,width] duration-200 [&.is-down]:w-10"
      aria-hidden="true"
    >
      <CarSvg className="h-auto w-full drop-shadow-[0_6px_10px_rgba(114,47,55,0.4)]" />
    </div>
  );
}
