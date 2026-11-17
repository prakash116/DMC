# Items the owner must confirm before go-live

Nothing in this list is shown to visitors as a placeholder. Where a claim could not be verified, the
website text was changed to neutral wording and the original claim is recorded here. Confirm an item,
then restore or correct the text in the file named.

## Business facts — `src/lib/business.ts`

| # | Item | Current value |
|---|------|---------------|
| 1 | Opening hours — **confirmed: Option A (open daily 10 AM–8 PM)**. Check the Google Business Profile says the same. | `"A"` |
| 2 | Google rating and review count (update by hand when they change) | 4.8, 26 |
| 2a | Map pin latitude / longitude used in the schema (taken from the Google Maps embed) | 28.7281667, 77.1123765 |
| 3 | "Read our Google reviews" link opens the right profile (`googleProfileUrl`, derived from the review link) | `https://g.page/r/Cf83TaFajjA_EBM` |

## Offers — `src/lib/offers.ts`

| # | Offer | Confirm |
|---|-------|---------|
| 4 | Holy Wash — 20% off Premium Wash | Still valid? End date? |
| 5 | Golden Temple pilgrims — 33% off Premium Wash | Still valid? End date? |
| 6 | "Ceramic & graphene coating with up to 9 years protection" | Is the 9-year claim accurate and backed by the product maker? |

## Reviews — `src/lib/testimonials.ts`

| # | Item |
|---|------|
| 7 | Paste more real Google reviews (name, rating, exact text, service if mentioned, date). The 4 starter reviews have no date or service yet. |

## Claims removed from the site (restore only if true)

| # | Original claim | Where it was | Now reads |
|---|----------------|--------------|-----------|
| 8 | "4.9 / 5 Rating on Google Reviews · 150+ Reviews" | home reviews | real rating and count from config |
| 9 | 4 invented testimonials (Aman Sharma, Vikas Goel, Dr. Ritu Malhotra, Rajesh Aggarwal) + "Verified Customer" | `db/home.json` | deleted |
| 10 | "9H ceramic coatings", "9H/10H", "Multi-year 9H ceramic shield" | `db/home.json`, before/after | "ceramic coatings" |
| 11 | "self-healing" PPF | `db/home.json` | "TPU paint protection film" |
| 12 | "Garware" PPF brand named as the film used | `db/home.json`, booking form | brand name removed |
| 13 | PPF "5 to 7 Years Warranty" | `db/home.json` | removed |
| 14 | Coatings "1 to 7 Years Protection" | `db/home.json` | removed |
| 15 | "eliminate 90%+ scratches" / "Eliminates 90%+ swirl marks" / "90%+ defect removal" | `db/home.json`, before/after | "reduce swirl marks and light scratches" |
| 16 | "Menzerna & Koch-Chemie compounds", "Dual-action polishers" | `db/home.json` | generic wording |
| 17 | "Certified Detailers", "Certified Master Detailers … years of expertise" | `db/home.json` | "Trained Detailers" |
| 18 | "100% Genuine Global Brands … exclusively use Meguiar's, 3M, Koch-Chemie, CarPro, Menzerna, Garware" | `db/home.json` | "Genuine Global Brands" |
| 19 | "temperature-controlled, dust-free detailing bays" / "Dust-Free Detailing Bay" | `db/home.json`, booking form | "dedicated detailing studio" |
| 20 | "Long-Term Warranty & Support — Comprehensive warranties on Ceramic & PPF" | `db/home.json` | "After-Care Support" |
| 21 | "140°C high-temp steam", "two-bucket pH-neutral" | before/after section | generic wording |
| 22 | Booking options "Ceramic Coating (1, 3 or 5-Year Protection)", "PPF - Garware / TPU" | booking form | "Ceramic Coating", "Paint Protection Film (PPF)" |
| 23 | PPF "High Gloss or Satin Matte" finishes | `db/home.json` | removed |

## Claims still on the site — confirm or tell me to change

| # | Claim | Where |
|---|-------|-------|
| 24 | Service names with durations: "Two-Week Paint Coating", "Three Months Protection", "One Year Protection (Lite Ceramic)", "Three Years Protection", "Five to Seven Years Protection", "Graphene Coating with Nine Years Protection" | `db/services.json` (services page list) |
| 25 | The Brands page and home brand strip list 23 brands (3M, Meguiar's, CarPro, Koch-Chemie, Menzerna, Garware Hitech Films …). Are all of them really used? | `db/brands.json` |
| 26 | **Before & After section uses unrelated stock/service photos as "before" and "after"** (not the same car). Supply real pairs or the section should be removed. | `src/components/gallery/before-after.tsx` |
| 27 | PPF "190-micron TPU film", "Anti-yellowing film" (taken from your brief) | `db/home.json` |

## Service pages — `src/lib/services-data.ts`

| # | Item |
|---|------|
| 28 | **All starting prices are verified by the client** (₹400 – ₹45,000 across the 7 service pages). |
| 29 | Time estimates written into the pages: coatings "one to two days", PPF "a few days", interior "a few hours", foam wash "under an hour", polishing "same day". Correct any that are wrong. |
| 30 | Monthly package terms written into the page: prepaid for the month, one car per package, month-to-month with no lock-in, cheaper than single visits. What do Silver and Gold actually include, and how many visits? |
| 31 | What the Premium Wash includes (the page says to ask on WhatsApp). |
| 32 | "PPF can be removed without harming original factory paint" and "edges wrapped where the panel shape allows" — confirm these match the film and your fitting practice. |
| 33 | No coating durability, warranty years or product brands are stated on the service pages. Send confirmed figures if you want them added. |

## Photos

| # | Item |
|---|------|
| 34 | The service photos (foam-covered black sedan, polisher, wheel, interior brush, detailer with black car) look like stock images, not the studio's own work. Replace with real job photos when available. |
| 35 | There is no real PPF photo; the PPF page uses general studio and polishing photos. |
| 36 | Number plates: the studio's own photos show no customer cars. Only `public/images/services/car-foam-wash-rohini.jpg` has a plate area — check it at full size and blur if readable. |
| 37 | Real before/after photo pairs for the Before & After section (client to send). |

## Setup values (Vercel → Settings → Environment Variables)

| # | Variable | Value |
|---|----------|-------|
| 38 | `NEXT_PUBLIC_GA_ID` | GA4 Measurement ID (G-XXXXXXXXXX) |
| 39 | `GOOGLE_SITE_VERIFICATION` | Search Console HTML-tag verification code |
