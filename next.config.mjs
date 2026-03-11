import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  typedRoutes: true,
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