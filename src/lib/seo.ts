import type { Metadata } from "next";
import { business } from "./business";

const H = business.hours.short; // e.g. "daily 10 AM–8 PM"
const AREA = business.address.area; // "Sector 11, Rohini"

/* Title (≤ ~60 characters) and description (140–160 characters) for every static page. Hours come from the business config. */
export const PAGE_META = {
  "/": {
    title: "Car Detailing & Ceramic Coating in Rohini | The Detailing Monk",
    description: `Car detailing studio in ${AREA}: ceramic coating, PPF, polishing, foam wash and interior dry cleaning. Open ${H}. Call or WhatsApp.`,
  },
  "/services": {
    title: "Car Detailing Services & Prices in Rohini | The Detailing Monk",
    description: `Car detailing services in Rohini with starting prices: foam wash, interior dry cleaning, polishing, ceramic and graphene coating, PPF. Open ${H}.`,
  },
  "/about-us": {
    title: "About The Detailing Monk – Car Detailing Studio in Rohini",
    description: `Meet The Detailing Monk, a car detailing studio in ${AREA}, Delhi, built on passion, devotion and craft. Visit us ${H}.`,
  },
  "/contact-us": {
    title: "Contact The Detailing Monk – Sector 11, Rohini, Delhi",
    description: `Visit The Detailing Monk at ${business.address.street}, Rohini, Delhi ${business.address.postalCode}. Call or WhatsApp ${business.phone}. Open ${H}.`,
  },
  "/gallery": {
    title: "Car Detailing Gallery in Rohini, Delhi | The Detailing Monk",
    description: `Photos and videos of car detailing, polishing, foam wash and ceramic coating work done at The Detailing Monk studio in ${AREA}, Delhi.`,
  },
  "/brands": {
    title: "Premium Car Care Brands We Use | The Detailing Monk",
    description: `See the car care brands The Detailing Monk uses for washing, polishing, coating and paint protection at its studio in ${AREA}, Delhi.`,
  },
  "/eco-commitment": {
    title: "Eco-Friendly Car Detailing in Rohini | The Detailing Monk",
    description: "How The Detailing Monk in Rohini, Delhi keeps car detailing responsible: saving water, choosing eco-friendly products and managing waste with care.",
  },
  "/seva-through-detailing": {
    title: "Holy Wash Offers in Rohini, Delhi | The Detailing Monk",
    description: `Seva Through Detailing: Premium Wash offers for pilgrims and holy journeys at The Detailing Monk, ${AREA}. Open ${H}. Book on WhatsApp.`,
  },
  "/sitemap": {
    title: "Sitemap – All Pages of The Detailing Monk, Rohini, Delhi",
    description: "All pages of The Detailing Monk website: car detailing services, gallery, brands, eco commitment, offers and contact details for our Rohini studio.",
  },
} as const;

export type StaticPath = keyof typeof PAGE_META;

export const OG_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630, alt: "Car detailing at The Detailing Monk studio in Rohini, Delhi" };

type BuildArgs = { path: string; title: string; description: string; image?: { url: string; width: number; height: number; alt: string } };

/** Full metadata for one page: title, description, canonical, Open Graph and Twitter card */
export function buildMetadata({ path, title, description, image = OG_IMAGE }: BuildArgs): Metadata {
  const url = path === "/" ? "/" : path; // resolved against metadataBase (the live domain)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", title, description, url, siteName: business.name, locale: "en_IN", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

export const pageMetadata = (path: StaticPath): Metadata => buildMetadata({ path, ...PAGE_META[path] });
