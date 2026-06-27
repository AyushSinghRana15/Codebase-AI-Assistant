// Next.js config — API rewrites to backend and legacy URL redirects

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Rewrite /api/* requests to the backend server
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL || "http://localhost:8000"}/:path*`,
      },
    ];
  },
  // Redirect old /website/* routes to home
  async redirects() {
    return [
      {
        source: "/website",
        destination: "/",
        permanent: true,
      },
      {
        source: "/website/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
