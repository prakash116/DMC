import { business, googleRatingLabel } from "@/lib/business";

/* Home: address, hours, directions, review button and map. All facts come from the business config. */
export function VisitUs() {
  const { address, hours } = business;
  const btn =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-burgundy";
  return (
    <section id="visit-us" className="scroll-mt-24 bg-surface-muted/40 py-14 sm:py-24 lg:py-28" aria-labelledby="visit-heading">
      <div className="mx-auto grid max-w-7xl items-stretch gap-10 px-5 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <div className="flex flex-col justify-center">
          <p className="font-display text-lg italic text-primary">Visit the studio</p>
          <h2 id="visit-heading" className="mt-2 font-display text-4xl font-medium leading-[1.08] text-foreground sm:text-5xl">
            Find us in {address.area}
          </h2>

          <dl className="mt-8 space-y-5 text-base">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-foreground/70">Address</dt>
              <dd className="mt-1 text-foreground">
                <address className="not-italic">
                  {business.name}
                  <br />
                  {address.full}
                </address>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-foreground/70">Opening hours</dt>
              <dd className="mt-1 text-foreground">
                {hours.text}
                {hours.closed ? ` · ${hours.closed} closed` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-foreground/70">Phone</dt>
              <dd className="mt-1">
                <a href={business.phoneHref} className="font-semibold text-deep-burgundy underline decoration-deep-burgundy/40 underline-offset-4">
                  {business.phone}
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={address.directionsHref} target="_blank" rel="noopener noreferrer" className={`${btn} bg-deep-burgundy text-white`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Get Directions
            </a>
            <a href={business.googleReviewUrl} target="_blank" rel="noopener noreferrer" className={`${btn} border border-deep-burgundy/40 bg-surface text-deep-burgundy`}>
              Write a Google review
            </a>
          </div>
          <p className="mt-4 text-sm text-foreground/70">
            <a href={business.googleProfileUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              {googleRatingLabel}
            </a>
          </p>
        </div>

        <div className="min-h-80 overflow-hidden rounded-3xl border border-border bg-cosmic-latte shadow-[0_30px_60px_-34px_rgba(114,47,55,0.5)]">
          <iframe
            src={address.mapEmbed}
            title={`Map showing ${business.name}, ${address.area}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-80 w-full border-0"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
