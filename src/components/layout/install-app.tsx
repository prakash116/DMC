"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/*
 * "Install App" button. The site is a PWA (see app/manifest.ts), so it installs like a phone app:
 * - Android / desktop Chrome & Edge: opens the browser's native install prompt
 *   (`beforeinstallprompt` is captured early by an inline script in app/layout.tsx).
 * - iPhone / iPad: Apple offers no install prompt, so we show the "Share → Add to Home Screen" steps.
 * - Other browsers: show the "browser menu → Install app" steps.
 * Hidden when the site is already running as the installed app.
 */

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    __tdmInstallPrompt?: InstallPromptEvent | null;
    __tdmInstalled?: boolean;
  }
}

export const INSTALL_EVENT = "tdm-installprompt";

type Mode = "hidden" | "prompt" | "ios" | "manual";

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(display-mode: standalone)");
  window.addEventListener(INSTALL_EVENT, cb);
  mq.addEventListener("change", cb);
  return () => {
    window.removeEventListener(INSTALL_EVENT, cb);
    mq.removeEventListener("change", cb);
  };
}

function getMode(): Mode {
  const nav = navigator as Navigator & { standalone?: boolean };
  if (window.__tdmInstalled || nav.standalone || window.matchMedia("(display-mode: standalone)").matches) {
    return "hidden";
  }
  if (window.__tdmInstallPrompt) return "prompt";
  const ios =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return ios ? "ios" : "manual";
}

const useInstallMode = () => useSyncExternalStore(subscribe, getMode, () => "hidden" as Mode);

type Props = { variant?: "pill" | "block"; className?: string; onDone?: () => void };

export function InstallApp({ variant = "pill", className = "", onDone }: Props) {
  const mode = useInstallMode();
  const [guide, setGuide] = useState<"ios" | "manual" | null>(null);
  const closeGuide = useCallback(() => setGuide(null), []);

  if (mode === "hidden") return null;

  const install = async () => {
    const evt = window.__tdmInstallPrompt;
    if (mode === "prompt" && evt) {
      await evt.prompt();
      const { outcome } = await evt.userChoice;
      window.__tdmInstallPrompt = null; // a prompt event can be used only once
      if (outcome === "accepted") window.__tdmInstalled = true;
      window.dispatchEvent(new Event(INSTALL_EVENT));
      onDone?.();
      return;
    }
    setGuide(mode === "ios" ? "ios" : "manual");
  };

  return (
    <>
      {variant === "pill" ? (
        <button
          type="button"
          onClick={install}
          aria-label="Install The Detailing Monk app"
          title="Install our app"
          className={`glass items-center justify-center gap-1.5 whitespace-nowrap rounded-full p-2.5 xl:px-3.5 xl:py-2 text-sm font-semibold text-foreground transition-all hover:text-primary hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
        >
          <PhoneDownloadIcon />
          <span className="hidden xl:inline">Get App</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={install}
          className={`glass flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-foreground transition-transform active:scale-98 ${className}`}
        >
          <PhoneDownloadIcon />
          Install Our App
          <span className="text-xs font-medium text-muted">· Android &amp; iPhone</span>
        </button>
      )}

      {guide && <InstallGuide kind={guide} onClose={closeGuide} />}
    </>
  );
}

function InstallGuide({ kind, onClose }: { kind: "ios" | "manual"; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const steps =
    kind === "ios"
      ? [
          <>Open this site in <b>Safari</b>.</>,
          <>Tap the <b>Share</b> button <ShareIcon /> in the toolbar.</>,
          <>Scroll down and tap <b>Add to Home Screen</b>.</>,
          <>Tap <b>Add</b>. The Detailing Monk app appears on your home screen.</>,
        ]
      : [
          <>Open the browser menu (<b>⋮</b> on Android Chrome).</>,
          <>Tap <b>Install app</b> or <b>Add to Home screen</b>.</>,
          <>Confirm with <b>Install</b>. The app appears on your home screen.</>,
          <>Inside Instagram or Facebook? Open this page in Chrome or Safari first.</>,
        ];

  // portal: the header uses backdrop-filter, which would trap a fixed overlay inside it
  return createPortal(
    <div className="fixed inset-0 z-200 flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-guide-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-surface p-6 text-foreground shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="install-guide-title" className="font-display text-2xl leading-tight">
              Install our app
            </h2>
            <p className="mt-1 text-sm text-muted">
              {kind === "ios" ? "On iPhone / iPad" : "On Android & desktop"}: free, no app store needed.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <ol className="mt-5 space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-deep-burgundy py-3 text-sm font-semibold text-white active:scale-98 transition-transform"
        >
          Got it
        </button>
      </div>
    </div>,
    document.body,
  );
}

function PhoneDownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M12 7v7M9 11l3 3 3-3M10.5 18.5h3" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="inline -mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Share">
      <path d="M12 3v12M8 7l4-4 4 4" />
      <path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" />
    </svg>
  );
}
