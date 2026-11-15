import Image from "next/image";
import Link from "next/link";

/* Brand mark: light/dark PNG variants generated from public/logo/brand_logo.png */
export function Logo({ compact = false }: { compact?: boolean }) {
  const h = compact ? 32 : 40;
  const w = Math.round(h * (480 / 252)); // source aspect ratio

  return (
    <Link
      href="/"
      aria-label="The Detailing Monk Home"
      className="group flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <span
        className="relative shrink-0 transition-[width,height] duration-300 h-8 sm:h-10"
        style={{ width: w, height: h }}
      >
        <Image
          src="/logo/logo-light.png"
          alt="The Detailing Monk"
          fill
          sizes="(max-width: 640px) 68px, 160px"
          priority
          className="object-contain dark:hidden"
        />
        <Image
          src="/logo/logo-dark.png"
          alt="The Detailing Monk"
          fill
          sizes="(max-width: 640px) 68px, 160px"
          priority
          className="hidden object-contain dark:block"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className="whitespace-nowrap font-display font-semibold tracking-wide text-foreground text-[16px] sm:text-lg lg:text-xl transition-[font-size] duration-300"
        >
          The Detailing Monk
        </span>
        <span className="mt-0.5 whitespace-nowrap text-[10px] sm:text-[11px] tracking-[0.14em] text-muted hidden md:block">
          Passion&nbsp;&nbsp;Devotion&nbsp;&nbsp;Craft
        </span>
      </span>
    </Link>
  );
}
