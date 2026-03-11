import type { Metadata, Viewport } from "next";

import { APP_CONFIG } from "./app.config";

function getMetadataBase(): URL {
  try {
    return new URL(APP_CONFIG.url);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const baseMetadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: APP_CONFIG.name,
    template: `%s | ${APP_CONFIG.name}`
  },
  description: APP_CONFIG.description,
  applicationName: APP_CONFIG.name,
  authors: [{ name: APP_CONFIG.name }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_CONFIG.name
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export const baseViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2563eb"
};