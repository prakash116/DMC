import { db } from "@/lib/db";
import { TickerOffers } from "./ticker-offers";

const { contact, social } = db.site;

export function TopTicker() {
  return (
    <div className="bg-deep-burgundy text-mocha-cream">
      <div className="mx-auto flex max-w-7xl items-stretch px-3 sm:px-4 lg:px-6">
        {/* Offers marquee (live offers from src/lib/offers.ts + opening hours) */}
        <TickerOffers />

        {/* Phone + Instagram */}
        <div className="ml-3 flex shrink-0 items-center gap-1 border-l border-mocha-cream/20 pl-3 sm:ml-4 sm:gap-3 sm:pl-4">
          <a
            href={contact.phoneHref}
            className="flex min-w-8 items-center justify-center gap-1.5 py-2 text-[13px] font-medium transition-colors hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mocha-cream"
            aria-label={`Call ${contact.phone}`}
          >
            <PhoneIcon />
            <span className="hidden sm:inline">{contact.phone}</span>
          </a>
          <a
            href={social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-8 items-center justify-center gap-1.5 py-2 text-[13px] font-medium transition-colors hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mocha-cream"
            aria-label={`Instagram ${social.instagramHandle}`}
          >
            <InstagramIcon />
            <span className="hidden md:inline">{social.instagramHandle}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.8 2z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
