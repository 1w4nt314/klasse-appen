/** Illustration til app-kortet: en navnetrækning på tavlen. */
export function Thumbnail() {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full" role="img" aria-label="Navnetrækker">
      <rect width="320" height="180" fill="#e8eff7" />
      <g fill="#ffffff" stroke="#c3cbd2">
        <rect x="18" y="24" width="64" height="26" rx="5" />
        <rect x="18" y="58" width="64" height="26" rx="5" />
        <rect x="18" y="92" width="64" height="26" rx="5" />
        <rect x="18" y="126" width="64" height="26" rx="5" />
      </g>
      <g fontFamily="ui-sans-serif, system-ui" fontSize="12" fontWeight="700" fill="#566372">
        <text x="30" y="41">Ida</text>
        <text x="30" y="75">Noah</text>
        <text x="30" y="109" fill="#c3cbd2" textDecoration="line-through">Freja</text>
        <text x="30" y="143">Alma</text>
      </g>
      <rect x="104" y="28" width="198" height="124" rx="10" fill="#ffffff" stroke="#c3cbd2" />
      <text x="203" y="58" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="800" letterSpacing="1.5" fill="#0f6b7a">
        DET BLEV
      </text>
      <text x="203" y="104" textAnchor="middle" fontFamily="Georgia, serif" fontSize="40" fontWeight="700" fill="#133b69">
        Markus
      </text>
      <rect x="160" y="118" width="86" height="22" rx="5" fill="#1a4f8b" />
      <text x="203" y="133" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="10" fontWeight="800" fill="#fff">
        Træk næste
      </text>
      <g>
        <rect x="132" y="40" width="6" height="9" rx="1.5" fill="#e3a008" transform="rotate(20 135 44)" />
        <rect x="268" y="46" width="6" height="9" rx="1.5" fill="#e0352b" transform="rotate(-25 271 50)" />
        <rect x="282" y="78" width="6" height="9" rx="1.5" fill="#5bb54f" transform="rotate(40 285 82)" />
        <rect x="122" y="84" width="6" height="9" rx="1.5" fill="#0f6b7a" transform="rotate(-35 125 88)" />
        <rect x="250" y="34" width="6" height="9" rx="1.5" fill="#1a4f8b" transform="rotate(10 253 38)" />
      </g>
    </svg>
  );
}
