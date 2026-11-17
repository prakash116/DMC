import { business } from "./business";
import type { Faq, Service } from "./services-data";

/* JSON-LD builders. Everything is derived from the business config and the services data file. */

const abs = (path: string) => `${business.siteUrl}${path === "/" ? "" : path}`;
const BUSINESS_ID = `${business.siteUrl}/#business`;

/** Site-wide LocalBusiness. No AggregateRating / Review: Google does not allow self-serving review markup. */
export function localBusinessSchema() {
  const { address, hours, social } = business;
  return {
    "@context": "https://schema.org",
    "@type": ["AutomotiveBusiness", "AutoWash"],
    "@id": BUSINESS_ID,
    name: business.name,
    url: business.siteUrl,
    logo: abs("/logo/icon-512.png"),
    image: [abs("/og-image.jpg"), abs("/images/gallery/large/the-detailing-monk-studio-front-sector-11-rohini.jpg")],
    telephone: business.phoneHref.replace("tel:", ""),
    email: business.email,
    priceRange: business.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.locality,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: address.geo.latitude, longitude: address.geo.longitude },
    hasMap: business.googleProfileUrl,
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: [...hours.openDayNames], opens: hours.opens, closes: hours.closes },
    ],
    areaServed: ["Rohini", "Pitampura", "Shalimar Bagh", "Prashant Vihar", "New Delhi"],
    sameAs: [social.instagram, social.facebook, social.youtube, business.googleProfileUrl],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

/** must mirror the FAQs that are visible on the page */
export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function serviceSchema(s: Service) {
  const url = abs(`/${s.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: `${s.name} in Rohini, Delhi`,
    serviceType: s.serviceType,
    description: s.short,
    url,
    image: abs(s.hero.src),
    provider: { "@id": BUSINESS_ID },
    areaServed: [
      { "@type": "City", name: "New Delhi" },
      { "@type": "Place", name: "Rohini, Delhi" },
    ],
    offers: s.priceRows.map((row) => ({
      "@type": "Offer",
      name: row.label,
      priceCurrency: "INR",
      price: row.price,
      priceSpecification: { "@type": "PriceSpecification", priceCurrency: "INR", minPrice: row.price },
      availability: "https://schema.org/InStock",
      url,
    })),
  };
}
