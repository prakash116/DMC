import Link from "next/link";
import { formatINR, type Service } from "@/lib/services-data";

/* Card for one service: name, short description, starting price and a link to its page */
export function ServiceCard({ service, headingLevel = "h3" }: { service: Service; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <Link
      href={`/${service.slug}`}
      className="group flex h-full flex-col rounded-3xl border border-border/80 bg-surface p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-deep-burgundy/40 hover:shadow-[0_20px_40px_-20px_rgba(114,47,55,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-7"
    >
      <Heading className="font-display text-2xl font-medium leading-tight text-foreground">{service.name}</Heading>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">{service.short}</p>
      <p className="mt-5 text-sm text-muted">
        Starting from <span className="font-display text-2xl font-semibold text-deep-burgundy">{formatINR(service.priceFrom)}</span>
      </p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-deep-burgundy">
        View details
        <svg className="transition-transform group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
