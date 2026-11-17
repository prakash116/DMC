import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: `Page Not Found | ${business.name}`,
  description: "This page does not exist. Go to the home page, see our car detailing services or contact the studio.",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/", label: "Home", text: "Back to the start" },
  { href: "/services", label: "Services", text: "Washes, polishing, coatings & PPF" },
  { href: "/contact-us", label: "Contact", text: "Address, hours and directions" },
];

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-20 text-center sm:px-6 sm:py-28">
        <p className="font-display text-lg italic text-primary">Error 404</p>
        <h1 className="mt-2 font-display text-5xl font-medium leading-[1.05] text-foreground sm:text-6xl">Page not found</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          The page you are looking for has moved or no longer exists. Try one of these instead, or call us on{" "}
          <a href={business.phoneHref} className="font-semibold text-primary underline underline-offset-4">
            {business.phone}
          </a>
          .
        </p>
        <ul className="mt-10 grid w-full gap-4 sm:grid-cols-3">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="glass block h-full rounded-2xl px-5 py-5 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="block font-display text-2xl text-foreground">{l.label}</span>
                <span className="mt-1 block text-sm text-muted">{l.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
