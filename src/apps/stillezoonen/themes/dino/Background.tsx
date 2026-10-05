/**
 * Dino-dalen bag figurerne. Tegnet i 1600×900 og beskåret med `slice`.
 * Jordens overkant ligger ved y≈606; figurerne går i båndet nedenunder.
 * (Midlertidig enkel scene — erstattes af den færdige tegning.)
 */

type Props = { className?: string; animated?: boolean };

export function Background({ className, animated = true }: Props) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
      data-animated={animated || undefined}
    >
      <rect width="1600" height="900" fill="#f6c98a" />
      <rect y="606" width="1600" height="294" fill="#a7c968" />
    </svg>
  );
}

export function Foreground({ className }: { className?: string }) {
  return <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true" />;
}
