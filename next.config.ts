import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Opgavelabs fontfiler (1,5 MB) ændrer sig aldrig: lang cache i stedet for
        // Next-standarden max-age=0 for public/. Skift filnavnet, hvis en font udskiftes.
        // Kun .ttf: licensteksten (DejaVuSans-LICENSE.txt) beholder Next-standarden.
        source: "/fonts/:file([^/]+\\.ttf)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    return [
      // Klasse Zoo hedder nu Stillezoonen.
      { source: "/apps/klasse-zoo", destination: "/apps/stillezoonen", permanent: false },
    ];
  },
};

export default nextConfig;
