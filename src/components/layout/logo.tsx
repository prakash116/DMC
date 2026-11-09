import Image from "next/image";
import Link from "next/link";

/* Brand mark: light/dark PNG variants generated from public/logo/brand_logo.png */
export function Logo({ compact = false }: { compact?: boolean }) {
  const h = compact ? 36 : 44;
  const w = Math.round(h * (480 / 252)); // source aspect ratio

  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <span
        className="relative shrink-0 transition-[width,height] duration-300"
        style={{ width: w, height: h }}
      >
        <Image
          src="/logo/logo-light.png"
          alt=""
          fill
          sizes="160px"
          loading="eager"
          className="object-contain dark:hidden"
        />
        <Image
          src="/logo/logo-dark.png"
          alt=""
          fill
          sizes="160px"
          className="hidden object-contain dark:block"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`whitespace-nowrap font-display font-semibold tracking-wide text-foreground max-[359px]:text-base ${compact ? "text-lg" : "text-xl"} transition-[font-size] duration-300`}
        >
          The Detailing Monk
        </span>
        <span className="mt-1 whitespace-nowrap text-[11px] tracking-[0.16em] text-muted max-[359px]:hidden">
          Passion&nbsp;&nbsp;Devotion&nbsp;&nbsp;Craft
        </span>
      </span>
    </Link>
  );
}
