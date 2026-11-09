import { useId } from "react";

/*
 * Modern low-slung coupé (side profile, facing right): fastback roof, LED light bars, aero wheels.
 * Shared by the cursor and the drive-across reveal.
 *   paint  – "chroma": burgundy → rose → copper colour-shift (default, brand-led)
 *            "midnight": dark gloss with burgundy edge light
 *   spin   – wheels rotate (driving)
 *   glow   – LED underglow + light trails
 */
type Paint = "chroma" | "midnight";

const PAINTS: Record<Paint, [string, string, string, string]> = {
  chroma: ["#3b0f1a", "#8a2337", "#d2556a", "#e9a970"],
  midnight: ["#120c0e", "#2a1a1e", "#4a2a31", "#722F37"],
};

export function CarSvg({
  className = "",
  paint = "chroma",
  spin = false,
  glow = true,
}: {
  className?: string;
  paint?: Paint;
  spin?: boolean;
  glow?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (n: string) => `${n}-${uid}`;
  const [c0, c1, c2, c3] = PAINTS[paint];

  return (
    <svg viewBox="0 0 240 80" className={className} aria-hidden="true" overflow="visible">
      <defs>
        {/* colour-shift paint runs along the body */}
        <linearGradient id={id("paint")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={c0} />
          <stop offset="0.38" stopColor={c1} />
          <stop offset="0.72" stopColor={c2} />
          <stop offset="1" stopColor={c3} />
        </linearGradient>
        {/* clear-coat: bright top edge, darker rocker */}
        <linearGradient id={id("coat")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.28" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a2326" />
          <stop offset="0.5" stopColor="#0d0a0b" />
          <stop offset="1" stopColor="#3a2c30" />
        </linearGradient>
        <radialGradient id={id("rim")} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#f4ede4" />
          <stop offset="0.6" stopColor="#a99a8d" />
          <stop offset="1" stopColor="#4e4440" />
        </radialGradient>
        <radialGradient id={id("under")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={c2} stopOpacity="0.85" />
          <stop offset="1" stopColor={c2} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("head")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff6dc" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff6dc" stopOpacity="0" />
        </linearGradient>
        <filter id={id("bloom")} x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      {/* ground shadow + underglow */}
      <ellipse cx="122" cy="74" rx="104" ry="4.5" fill="#000" opacity="0.28" />
      {glow && <ellipse cx="122" cy="70" rx="96" ry="6" fill={`url(#${id("under")})`} />}

      {/* headlight beam */}
      {glow && <path d="M230 42 L300 30 L300 58 Z" fill={`url(#${id("head")})`} opacity="0.7" />}

      {/* body */}
      <path
        d="M14 58 L10 55 L8 46 Q8 38 16 36 L32 34 C58 27 84 14 118 12 C140 11 154 16 170 29 C192 32 214 36 228 42 Q235 46 232 52 L228 58 L203.6 58 A17 17 0 0 0 168.4 58 L75.6 58 A17 17 0 0 0 40.4 58 Z"
        fill={`url(#${id("paint")})`}
      />
      <path
        d="M14 58 L10 55 L8 46 Q8 38 16 36 L32 34 C58 27 84 14 118 12 C140 11 154 16 170 29 C192 32 214 36 228 42 Q235 46 232 52 L228 58 L203.6 58 A17 17 0 0 0 168.4 58 L75.6 58 A17 17 0 0 0 40.4 58 Z"
        fill={`url(#${id("coat")})`}
      />

      {/* glasshouse */}
      <path d="M60 31 C80 21 98 16 118 15.2 C136 14.6 149 19 160 29.5 Z" fill={`url(#${id("glass")})`} />
      <path d="M118 15.2 L114 30.4" stroke={c1} strokeWidth="2.4" />
      <path d="M72 26 C90 19 104 17 116 16.6" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* character line + shoulder highlight */}
      <path d="M26 41 C80 38 150 37 224 44" stroke="#fff" strokeOpacity="0.35" strokeWidth="0.9" fill="none" />
      <path d="M34 35.5 C70 31 130 30 196 34" stroke="#fff" strokeOpacity="0.5" strokeWidth="0.7" fill="none" />

      {/* side intake + skirt */}
      <path d="M80 47 L100 44 L98 52 L84 53 Z" fill="#0d0a0b" opacity="0.75" />
      <path d="M78 57.5 L166 57.5 L163 54 L82 54 Z" fill="#0d0a0b" opacity="0.6" />
      {/* door seam + handle */}
      <path d="M112 31 L109 54" stroke="#000" strokeOpacity="0.25" strokeWidth="0.6" />
      <rect x="120" y="35.5" width="10" height="1.4" rx="0.7" fill="#fff" opacity="0.55" />
      {/* mirror */}
      <path d="M152 27 L160 26 Q163 27 161 30 L154 30 Z" fill={c1} />

      {/* LED headlight bar + DRL */}
      <path d="M212 39.5 L229 43.2" stroke="#fffaf0" strokeWidth="2" strokeLinecap="round" />
      {glow && <path d="M212 39.5 L229 43.2" stroke="#fff3cf" strokeWidth="4" strokeLinecap="round" filter={`url(#${id("bloom")})`} />}
      {/* full-width tail light */}
      <path d="M8.5 41 L22 38.6" stroke="#ff3b4e" strokeWidth="2.2" strokeLinecap="round" />
      {glow && <path d="M8.5 41 L22 38.6" stroke="#ff3b4e" strokeWidth="5" strokeLinecap="round" filter={`url(#${id("bloom")})`} />}
      {/* ducktail spoiler */}
      <path d="M14 35.6 L30 33.4 L31 31.8 L15 34 Z" fill={c0} />

      <Wheel cx={58} rim={`url(#${id("rim")})`} accent={c3} spin={spin} />
      <Wheel cx={186} rim={`url(#${id("rim")})`} accent={c3} spin={spin} />
    </svg>
  );
}

function Wheel({ cx, rim, accent, spin }: { cx: number; rim: string; accent: string; spin: boolean }) {
  const cy = 60;
  return (
    <g>
      <circle cx={cx} cy={cy} r="13.5" fill="#0b0809" />
      <circle cx={cx} cy={cy} r="13.5" fill="none" stroke="#2a2124" strokeWidth="1.2" />
      {/* brake caliper sits still behind the spinning rim */}
      <path d={`M${cx - 6.5} ${cy - 5} A8.2 8.2 0 0 1 ${cx + 2} ${cy - 8}`} stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
      <g className={spin ? "car-wheel-spin" : undefined} style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx} cy={cy} r="9.6" fill="none" stroke={rim} strokeWidth="1.6" />
        {[0, 72, 144, 216, 288].map((a) => (
          <path
            key={a}
            d={`M${cx} ${cy} L${cx - 1.6} ${cy - 9} L${cx + 1.6} ${cy - 9} Z`}
            fill={rim}
            transform={`rotate(${a} ${cx} ${cy})`}
          />
        ))}
        <circle cx={cx} cy={cy} r="2.4" fill="#1a1416" stroke={rim} strokeWidth="0.8" />
      </g>
    </g>
  );
}
