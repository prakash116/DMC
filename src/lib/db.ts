// Typed accessors for the JSON content in /db. Server-only (imports JSON at build time).
import site from "../../db/site.json";
import home from "../../db/home.json";
import about from "../../db/about.json";
import services from "../../db/services.json";
import brands from "../../db/brands.json";
import eco from "../../db/eco.json";
import gallery from "../../db/gallery.json";
import contact from "../../db/contact.json";
import seva from "../../db/seva.json";

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
