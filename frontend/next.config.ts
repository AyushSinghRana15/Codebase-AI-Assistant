import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
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
