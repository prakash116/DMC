"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { CarSvg } from "./car-svg";

const noop = () => () => {};
// only on devices that have a mouse/trackpad AND can hover; some phones report `pointer: fine`
// (stylus / external-mouse support), so `hover: hover` + a touch-width check guard against that
const useFinePointer = () =>
  useSyncExternalStore(
    noop,
    () =>
      window.matchMedia("(pointer: fine) and (hover: hover)").matches &&
      !("ontouchstart" in window && window.innerWidth < 1024),
    () => false,
  );

export function CarCursor() {
  const fine = useFinePointer();
  const el = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine) return;
    const node = el.current;
    const car = body.current;
    if (!node || !car) return;
    document.documentElement.classList.add("car-cursor");

    let x = -100, y = -100, tx = x, ty = y, lastX = x, dir = 1, raf = 0, tilt = 0, still = 0;
    const onMove = (e: PointerEvent) => {
      // a touch event means this is really a touch device: hand the cursor back to the OS
      if (e.pointerType === "touch") {
        node.style.opacity = "0";
        document.documentElement.classList.remove("car-cursor");
        return;
      }
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
      const vx = (tx - x) * 0.28;
      const vy = (ty - y) * 0.28;
      x += vx;
      y += vy;
      // nose pitches with vertical motion; wheels spin + trail shows only while actually moving
      tilt += (Math.max(-14, Math.min(14, vy * 1.4)) * dir - tilt) * 0.2;
      const moving = Math.abs(vx) + Math.abs(vy) > 0.6;
      still = moving ? 0 : still + 1;
      node.classList.toggle("is-moving", still < 6);
      node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -62%)`;
      car.style.transform = `scaleX(${dir}) rotate(${tilt}deg)`;
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
      className="car-cursor-el group pointer-events-none fixed left-0 top-0 z-200 w-16 opacity-0 transition-[opacity,width] duration-200 [&.is-down]:w-13"
      aria-hidden="true"
      style={{ ["--wheel-speed" as string]: "0.3s" }}
    >
      <div ref={body} className="relative">
        {/* light trail behind the car while it moves */}
        <span className="absolute right-[92%] top-[52%] h-0.5 w-0 rounded-full bg-linear-to-l from-[#ff3b4e]/80 to-transparent transition-[width] duration-300 group-[.is-moving]:w-10" />
        <span className="absolute right-[92%] top-[68%] h-px w-0 rounded-full bg-linear-to-l from-[#e9a970]/80 to-transparent transition-[width] duration-300 group-[.is-moving]:w-7" />
        <CarSvg spin className="h-auto w-full drop-shadow-[0_6px_10px_rgba(114,47,55,0.45)]" />
      </div>
    </div>
  );
}
