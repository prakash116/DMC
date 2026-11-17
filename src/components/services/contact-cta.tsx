import { business, whatsappLink } from "@/lib/business";

/* Call / WhatsApp / Get Directions box with address and hours from the business config */
export function ContactCta({ heading, text, message, id }: { heading: string; text: string; message: string; id?: string }) {
  const btn =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mocha-cream";
  return (
    <section id={id} className="px-3 pb-14 sm:px-4 sm:pb-24 lg:px-6" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-7xl rounded-3xl bg-deep-burgundy px-6 py-10 text-mocha-cream sm:px-10 sm:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <h2 id="cta-heading" className="font-display text-3xl font-medium leading-tight text-white sm:text-4xl">
              {heading}
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-mocha-cream/90">{text}</p>
            <address className="mt-5 text-sm not-italic leading-relaxed text-mocha-cream/90">
              {business.name}, {business.address.full}
              <br />
              {business.hours.text}
              {business.hours.closed ? ` · ${business.hours.closed} closed` : ""}
            </address>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            <a href={business.phoneHref} className={`${btn} bg-white text-deep-burgundy`}>
              Call {business.phone}
            </a>
            <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#0f7d70] text-white`}>
              WhatsApp us
            </a>
            <a href={business.address.directionsHref} target="_blank" rel="noopener noreferrer" className={`${btn} border border-mocha-cream/50 text-white`}>
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
