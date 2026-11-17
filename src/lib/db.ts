// Typed accessors for the JSON content in /db, combined with the business config.
// Business facts (name, address, phone, hours, links) come ONLY from ./business.ts; offers from ./offers.ts.
import siteJson from "../../db/site.json";
import homeJson from "../../db/home.json";
import about from "../../db/about.json";
import services from "../../db/services.json";
import brands from "../../db/brands.json";
import eco from "../../db/eco.json";
import gallery from "../../db/gallery.json";
import contact from "../../db/contact.json";
import sevaJson from "../../db/seva.json";
import { business } from "./business";
import { offers } from "./offers";

/** replace `{{whatsapp}}` in JSON strings with the WhatsApp link from the business config */
function resolveTokens<T>(value: T): T {
  if (typeof value === "string") return value.replaceAll("{{whatsapp}}", business.whatsappHref) as T;
  if (Array.isArray(value)) return value.map(resolveTokens) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveTokens(v)])) as T;
  }
  return value;
}

const { hours, address } = business;

const site = {
  ...siteJson,
  name: business.name,
  tagline: business.tagline,
  url: business.siteUrl,
  contact: {
    phone: business.phone,
    phoneHref: business.phoneHref,
    whatsapp: business.whatsapp,
    whatsappHref: business.whatsappHref,
    email: business.email,
    address: { line1: address.line1, line2: address.line2, full: address.full, area: address.area, mapEmbed: address.mapEmbed },
    hours: hours.text,
    hoursShort: hours.label,
    /** "Monday is off" — empty when open every day */
    closedLine: hours.closed ? `${hours.closed} is off` : "",
    schedule: hours.schedule,
    directionsHref: address.directionsHref,
  },
  social: business.social,
};

const homeResolved = resolveTokens(homeJson);
const home = {
  ...homeResolved,
  about: {
    ...homeResolved.about,
    // opening-hours card on the home "About" block
    card: { big: hours.days, sub: hours.time, pill: hours.closedNote, line: `${address.area}, Delhi` },
  },
};

const seva = {
  ...sevaJson,
  /** offer cards (id + card text); components filter out expired ones with useLiveOffers */
  offers: offers.flatMap((o) => (o.card ? [{ id: o.id, ...o.card }] : [])),
};

export const db = { site, home, about, services, brands, eco, gallery, contact, seva } as const;

export type SiteData = typeof site;
export type HomeData = typeof home;
export type AboutData = typeof about;
export type ServicesData = typeof services;
export type BrandsData = typeof brands;
export type EcoData = typeof eco;
export type GalleryData = typeof gallery;
export type ContactData = typeof contact;
export type SevaData = typeof seva;
