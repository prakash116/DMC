"use client";

import { useSyncExternalStore } from "react";
import { isOfferLive, offers, todayInStudio, type Offer } from "@/lib/offers";

/*
 * Offers that should be visible right now. `active: false` offers never render. Offers past their
 * `endsOn` date are dropped in the browser (pages are prerendered, so the server cannot know "today");
 * the first server render shows all active offers and the list corrects itself on load.
 */
const noop = () => () => {};
const serverToday = () => null;

export function useLiveOffers(): Offer[] {
  const today = useSyncExternalStore(noop, todayInStudio, serverToday);
  return offers.filter((o) => (today ? isOfferLive(o, today) : o.active));
}
