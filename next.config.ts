import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Klasse Zoo hedder nu Stillezoonen.
      { source: "/apps/klasse-zoo", destination: "/apps/stillezoonen", permanent: false },
    ];
  },
};

export default nextConfig;
