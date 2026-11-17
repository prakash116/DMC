/*
 * SINGLE SOURCE OF TRUTH for business facts (name, address, phone, hours, rating, links).
 * Every page, meta description, footer and schema reads from here — edit facts ONLY in this file.
 * Items marked [CONFIRM] must be checked by the owner before go-live (see CONFIRM.md).
 */

/*
 * Opening hours — ONE setting. Must match the Google Business Profile exactly.
 *   "A" = Open daily 10:00–20:00
 *   "B" = Tuesday–Sunday 10:00–20:00, Monday closed
 * Confirmed by the owner: Option A.
 */
const HOURS_OPTION = "A" as "A" | "B";

const OPEN_HOUR = 10; // 24h clock, studio time
const CLOSE_HOUR = 20;
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const closedDays: number[] = HOURS_OPTION === "A" ? [] : [1]; // 0 = Sunday … 6 = Saturday
const daily = closedDays.length === 0;

const hours = {
  option: HOURS_OPTION,
  /** "Tuesday to Sunday, 10 AM to 8 PM" */
  text: daily ? "Open daily, 10 AM to 8 PM" : "Tuesday to Sunday, 10 AM to 8 PM",
  /** "daily 10 AM–8 PM" — reads after "Open …" in meta descriptions */
  short: daily ? "daily 10 AM–8 PM" : "Tue–Sun 10 AM–8 PM",
  /** "Daily, 10 AM–8 PM" — stand-alone label in tight UI */
  label: daily ? "Daily, 10 AM–8 PM" : "Tue–Sun, 10 AM–8 PM",
  /** "Tue – Sun" */
  days: daily ? "Mon – Sun" : "Tue – Sun",
  time: "10 AM to 8 PM",
  /** "Monday" or null when open every day */
  closed: daily ? null : "Monday",
  /** "Monday off" / "Open all week" */
  closedNote: daily ? "Open all week" : "Monday off",
  schedule: { timezone: "Asia/Kolkata", open: OPEN_HOUR, close: CLOSE_HOUR, closedDays },
  /** schema.org day names for openingHoursSpecification */
  openDayNames: DAY_NAMES.filter((_, i) => !closedDays.includes(i)),
  opens: `${String(OPEN_HOUR).padStart(2, "0")}:00`,
  closes: `${String(CLOSE_HOUR).padStart(2, "0")}:00`,
};

const PHONE_E164 = "+918826966825";
const WHATSAPP_NUMBER = "918826966825";
const GOOGLE_PLACE_SHORT = "https://g.page/r/Cf83TaFajjA_EBM";

export const business = {
  name: "The Detailing Monk",
  tagline: "Passion • Devotion • Craft",
  siteUrl: "https://www.thedetailingmonk.com",
  host: "www.thedetailingmonk.com",

  phone: "+91 88269 66825",
  phoneHref: `tel:${PHONE_E164}`,
  whatsapp: WHATSAPP_NUMBER,
  whatsappHref: `https://wa.me/${WHATSAPP_NUMBER}`,
  email: "monk.detailer@gmail.com",

  address: {
    full: "A1/138-139, Pocket 1, Sector 11, Rohini, New Delhi, Delhi 110085",
    line1: "A1/138-139, Pocket 1, Sector 11",
    line2: "Rohini, New Delhi - 110085",
    street: "A1/138-139, Pocket 1, Sector 11",
    locality: "Rohini, New Delhi",
    region: "Delhi",
    postalCode: "110085",
    country: "IN",
    /** short form for UI chips */
    area: "Sector 11, Rohini",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.711500417162!2d77.11237647601908!3d28.728166679730457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d01917b6b89f9%3A0x3f308e5aa14d37ff!2sThe%20Detailing%20Monk!5e0!3m2!1sen!2sin!4v1781776819663!5m2!1sen!2sin",
    /** [CONFIRM: exact pin] taken from the Google Maps embed above */
    geo: { latitude: 28.7281667, longitude: 77.1123765 },
    directionsHref:
      "https://www.google.com/maps/dir/?api=1&destination=The%20Detailing%20Monk%2C%20A1%2F138-139%20Pocket%201%20Sector%2011%20Rohini%20New%20Delhi%20110085",
  },

  hours,

  /** lowest and highest "starting from" prices on the site (see src/lib/services-data.ts) */
  priceRange: "₹400–₹45,000",

  /* Google reviews — update rating and count by hand whenever they change on Google */
  googleRating: 4.8,
  googleReviewCount: 26,
  /** opens the "write a review" box */
  googleReviewUrl: `${GOOGLE_PLACE_SHORT}/review`,
  /** opens the Google profile where reviews can be read. [CONFIRM: link opens the right profile] */
  googleProfileUrl: GOOGLE_PLACE_SHORT,

  social: {
    facebook: "https://www.facebook.com/share/1LtxXigYr5/",
    instagram: "https://www.instagram.com/the.detailingmonk",
    instagramHandle: "@the.detailingmonk",
    youtube: "https://youtube.com/@thedetailingmonk",
  },
} as const;

/** WhatsApp chat link with an optional pre-filled message */
export function whatsappLink(message?: string) {
  return message ? `${business.whatsappHref}?text=${encodeURIComponent(message)}` : business.whatsappHref;
}

/** "4.8★ on Google · 26 reviews" */
export const googleRatingLabel = `${business.googleRating.toFixed(1)}★ on Google · ${business.googleReviewCount} reviews`;
