"use client";

import { useEffect } from "react";
import Script from "next/script";
import { eventForHref, GA_ID, track } from "@/lib/analytics";

/*
 * Google Analytics 4, loaded after the page is interactive. Renders nothing without NEXT_PUBLIC_GA_ID.
 * One click listener on the document tracks every call / WhatsApp / directions / review link on the site,
 * so new buttons are tracked automatically. `booking_submit` is sent by the booking and enquiry forms.
 */
export function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const event = eventForHref(link.getAttribute("href") ?? "");
      if (event) track(event, { link_text: (link.textContent ?? "").trim().slice(0, 80), page_path: window.location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GA_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
