/* Side-profile sedan matching the 3D preloader car. Shared by the cursor and the drive-across overlay. */
export function CarSvg({ className = "", glossy = true }: { className?: string; glossy?: boolean }) {
  return (
    <svg viewBox="0 0 120 50" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="car-paint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={glossy ? "#9a3f4a" : "#6e5a48"} />
          <stop offset="0.55" stopColor={glossy ? "#722F37" : "#5e4b3b"} />
          <stop offset="1" stopColor={glossy ? "#4a1c22" : "#4a3a2e"} />
        </linearGradient>
        <linearGradient id="car-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a3a3d" />
          <stop offset="1" stopColor="#1a1214" />
        </linearGradient>
      </defs>
      {/* body */}
      <path
        d="M6 34 L8 24 Q9 20 14 19 L30 18 L42 9 Q44 7 48 7 L74 7 Q78 7 80 9 L92 18 L108 20 Q113 21 114 26 L115 34 Q115 37 112 37 L9 37 Q6 37 6 34 Z"
        fill="url(#car-paint)"
      />
      {/* windows */}
      <path d="M34 18 L43 10.5 Q44 9.5 46 9.5 L58 9.5 L58 18 Z" fill="url(#car-glass)" />
      <path d="M61 9.5 L73 9.5 Q75 9.5 76.5 11 L87 18 L61 18 Z" fill="url(#car-glass)" />
      {/* sheen */}
      {glossy && <path d="M14 21 L104 22 L106 24 L13 23 Z" fill="#E8DCC6" opacity="0.35" />}
      {/* lights */}
      <rect x="111" y="23" width="4" height="4" rx="1" fill="#fff0c0" />
      <rect x="6.5" y="24" width="3.5" height="4" rx="1" fill="#ff5a5a" />
      {/* wheels */}
      <circle cx="30" cy="37" r="8.5" fill="#1c1214" />
      <circle cx="30" cy="37" r="4.2" fill="#B7A89A" />
      <circle cx="30" cy="37" r="1.4" fill="#E8DCC6" />
      <circle cx="90" cy="37" r="8.5" fill="#1c1214" />
      <circle cx="90" cy="37" r="4.2" fill="#B7A89A" />
      <circle cx="90" cy="37" r="1.4" fill="#E8DCC6" />
    </svg>
  );
}
