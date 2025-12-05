import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.0.150",
        pathname: "/**", // permite qualquer caminho
      },
      {
        protocol: "https",
        hostname: "pub-cf2ec8db2f184d2ab44495473e1c1c12.r2.dev",
        pathname: "/**", // permite qualquer caminho
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
