"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/*
 * The intro (WebGL wash + drive-across) and the car cursor are desktop-only extras. Their code is split
 * out and only fetched on devices that will use them, so phones never download or hydrate it.
 * The head script sets html.tdm-intro before first paint; a static cover (in the layout) hides the page
 * until the real preloader mounts and takes over.
 */
const Preloader = dynamic(() => import("./preloader").then((m) => m.Preloader), { ssr: false });
const CarCursor = dynamic(() => import("./car-cursor").then((m) => m.CarCursor), { ssr: false });

export function IntroGate() {
  const [intro, setIntro] = useState(false);
  const [cursor, setCursor] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setIntro(document.documentElement.classList.contains("tdm-intro"));
      setCursor(window.matchMedia("(pointer: fine) and (hover: hover)").matches && !("ontouchstart" in window && window.innerWidth < 1024));
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {intro && <Preloader />}
      {cursor && <CarCursor />}
    </>
  );
}
