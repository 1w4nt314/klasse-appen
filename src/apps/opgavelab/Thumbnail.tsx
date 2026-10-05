/** Illustration til app-kortet: et opgaveark med en retvinklet trekant og et regnestykke. */
export function Thumbnail() {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full" role="img" aria-label="Opgavelab" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="180" fill="#e8eff7" />
      <rect x="86" y="10" width="148" height="209" rx="3" fill="#ffffff" stroke="#c3cbd2" />
      <g fontFamily="ui-sans-serif, system-ui" fill="#566372">
        <rect x="104" y="24" width="96" height="5" rx="2.5" fill="#dde2e6" />
        <rect x="104" y="35" width="70" height="5" rx="2.5" fill="#dde2e6" />
      </g>
      <polygon points="112,126 112,62 180,126" fill="#e8eff7" stroke="#16212e" strokeWidth="2" strokeLinejoin="round" />
      <path d="M112 116h10v10" fill="none" stroke="#16212e" strokeWidth="1.5" />
      <path d="M112 76a14 14 0 0 1 5 7" fill="none" stroke="#16212e" strokeWidth="1.2" />
      <path d="M165 126a14 14 0 0 0 -4 -9" fill="none" stroke="#16212e" strokeWidth="1.2" />
      <g fontFamily="ui-sans-serif, system-ui" fontSize="11" fontWeight="700" fill="#16212e">
        <text x="104" y="56">A</text>
        <text x="104" y="138">X</text>
        <text x="184" y="136">B</text>
      </g>
      <g fontFamily="ui-sans-serif, system-ui" fontSize="11" fontWeight="700" fill="#1a4f8b">
        <text x="120" y="96">53,1°</text>
        <text x="94" y="162" fill="#16212e">1a</text>
        <text x="110" y="162">X = ________</text>
      </g>
    </svg>
  );
}
