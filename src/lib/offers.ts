import { business } from "./business";

/*
 * SINGLE offers config — feeds the top banner and the Seva Through Detailing page.
 *   active — set false to hide an offer immediately
 *   endsOn — "YYYY-MM-DD" (last valid day, India time) or null for no end date; expired offers hide automatically
 * [CONFIRM] every offer below is still valid, and give an end date if it has one (see CONFIRM.md).
 */
export type Offer = {
  id: string;
  /** line shown in the top banner */
  text: string;
  href: string;
  active: boolean;
  endsOn: string | null;
  /** card on the Seva page (omit for banner-only lines) */
  card?: { title: string; discount: string; on: string; when: string };
};

export const offers: Offer[] = [
  {
    id: "holy-wash",
    text: "Holy Wash — 20% off Premium Wash before & after your journey",
    href: "/seva-through-detailing",
    active: true, // [CONFIRM: offer still valid]
    endsOn: null,
    card: { title: "Holy Wash", discount: "20% OFF", on: "On Premium Wash", when: "Before & After Your Journey" },
  },
  {
    id: "golden-temple",
    text: "Golden Temple pilgrims — 33% off Premium Wash",
    href: "/seva-through-detailing",
    active: true, // [CONFIRM: offer still valid]
    endsOn: null,
    card: { title: "For Golden Temple Pilgrims", discount: "33% OFF", on: "On Premium Wash", when: "Before & After Your Yatra" },
  },
  {
    id: "coating-protection",
    text: "Ceramic & graphene coating with up to 9 years protection",
    href: "/services#paint-restoration",
    active: true, // [CONFIRM: "up to 9 years protection" claim is accurate and can be backed up]
    endsOn: null,
  },
];

/** the hours line that closes the banner (always current, read from the business config) */
export const hoursBannerLine = { text: business.hours.text.startsWith("Open") ? business.hours.text : `Open ${business.hours.text}`, href: "/contact-us" };

/** today's date in the studio's timezone as "YYYY-MM-DD" */
export function todayInStudio(now: Date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: business.hours.schedule.timezone }).format(now);
}

export function isOfferLive(offer: Offer, today: string) {
  return offer.active && (offer.endsOn === null || today <= offer.endsOn);
}
