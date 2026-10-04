import Link from "next/link";

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="var(--brand)" />
      <rect x="7" y="7" width="8" height="8" rx="2" fill="#fff" />
      <rect x="17" y="7" width="8" height="8" rx="2" fill="#fff" opacity="0.55" />
      <rect x="7" y="17" width="8" height="8" rx="2" fill="#fff" opacity="0.55" />
      <rect x="17" y="17" width="8" height="8" rx="4" fill="var(--star)" />
    </svg>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2.5 rounded-control font-extrabold tracking-tight text-ink"
    >
      <LogoMark />
      <span className="whitespace-nowrap text-lg">Klasse-appen</span>
    </Link>
  );
}
