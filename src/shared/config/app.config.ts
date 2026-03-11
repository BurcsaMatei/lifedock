export const APP_CONFIG = {
  name: "LifeDock",
  description:
    "Hub simplu pentru documente, evenimente, facturi si obligatii, in spatii separate pentru personal, student si companie.",
  locale: "ro-RO",
  defaultTheme: "light",
  supportEmail: "support@lifedock.app",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
} as const;

export type AppThemeMode = typeof APP_CONFIG.defaultTheme;