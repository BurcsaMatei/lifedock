import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";
import type { NextConfig } from "next";

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    typedRoutes: true
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85, 100],
    localPatterns: [
      {
        pathname: "/**"
      }
    ]
  }
};

export default withVanillaExtract(nextConfig);
