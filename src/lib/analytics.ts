/* Google Analytics 4 helpers. Nothing is sent unless NEXT_PUBLIC_GA_ID is set (see .env.example). */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export type AnalyticsEvent = "call_click" | "whatsapp_click" | "directions_click" | "review_click" | "booking_submit";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** send one GA4 event (safe to call when analytics is off) */
export function track(event: AnalyticsEvent, params: Record<string, string> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params);
}

/** which event (if any) a clicked link stands for */
export function eventForHref(href: string): AnalyticsEvent | null {
  if (href.startsWith("tel:")) return "call_click";
  if (href.includes("wa.me/") || href.includes("api.whatsapp.com")) return "whatsapp_click";
  if (href.includes("g.page/") || href.includes("search.google.com/local/writereview")) return "review_click";
  if (href.includes("google.com/maps") || href.includes("maps.app.goo.gl")) return "directions_click";
  return null;
}
