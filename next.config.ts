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
    ],
  },
};

export default nextConfig;
