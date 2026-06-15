import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL || "http://localhost:8000"}/:path*`,
      },
    ];
  },
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
