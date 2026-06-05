import { cn } from "@/lib/utils";

/**
 * The Al-Ghazzawi emblem — a filled hexagon (royal→navy) with a cyan glow edge,
 * the bold غ monogram, and a cyan network node at a vertex. Reused for the
 * header lockup, the favicon, and the social-share (OG) image.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="شعار أكاديمية الغزاوي"
    >
      <defs>
        <linearGradient id="agz-mark-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1E40AF" />
          <stop offset="0.6" stopColor="#0A0E27" />
          <stop offset="1" stopColor="#06091A" />
        </linearGradient>
      </defs>
      <path
        d="M32 4 L56.2 18 L56.2 46 L32 60 L7.8 46 L7.8 18 Z"
        fill="url(#agz-mark-grad)"
      />
      <path
        d="M32 4 L56.2 18 L56.2 46 L32 60 L7.8 46 L7.8 18 Z"
        fill="none"
        stroke="#06B6D4"
        strokeOpacity="0.55"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <text
        x="32"
        y="43.5"
        textAnchor="middle"
        fontFamily="var(--font-tajawal), 'SF Arabic', sans-serif"
        fontWeight="800"
        fontSize="32"
        fill="#FAFAFA"
      >
        غ
      </text>
      <circle cx="56.2" cy="18" r="3.6" fill="#06B6D4" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="size-9 shrink-0" />
      <div className="flex flex-col leading-tight">
        <span className="font-bold text-foreground text-[15px]">
          أكاديمية الغزاوي
        </span>
        <span className="text-[10px] font-medium text-muted tracking-wider uppercase">
          Learn in Arabic
        </span>
      </div>
    </div>
  );
}
