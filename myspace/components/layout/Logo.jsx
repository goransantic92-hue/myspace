import { BRAND } from "@/lib/brand";

export function LogoMark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 20 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      aria-hidden="true"
      className={className}
    >
      <path d="M4.5 25V11a5.5 5.5 0 0 1 11 0v14" />
      <path d="M2 11h5M13 11h5" />
    </svg>
  );
}

export default function Logo({ className = "" }) {
  return (
    <span
      role="img"
      aria-label={BRAND}
      className={`inline-flex items-end gap-[0.3em] font-sans leading-none ${className}`}
    >
      <LogoMark className="mb-[0.21em] h-[0.87em] w-auto shrink-0" />
      <span
        aria-hidden="true"
        className="border-b border-current pb-[0.1em] font-semibold tracking-[-0.045em]"
      >
        {BRAND}
      </span>
    </span>
  );
}
