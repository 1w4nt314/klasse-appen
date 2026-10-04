// PLADSHOLDER — erstattes af temaets rigtige baggrund.
export function Background({ className }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <rect width="1600" height="900" fill="#2a1f4a" />
      <rect y="610" width="1600" height="290" fill="#888" />
    </svg>
  );
}

export function Foreground({ className }: { className?: string }) {
  return <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true" />;
}
