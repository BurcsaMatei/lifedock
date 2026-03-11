import { createTheme } from "@vanilla-extract/css";

import { vars } from "./contract.css";

export const [themeClass] = createTheme(vars, {
  color: {
    backgroundCanvas: "#f5f7fb",
    backgroundSurface: "#ffffff",
    backgroundSurfaceRaised: "#ffffff",
    borderSoft: "#e3e8f2",
    borderStrong: "#cfd7e6",
    textPrimary: "#111827",
    textSecondary: "#475467",
    textMuted: "#667085",
    accent: "#2563eb",
    accentHover: "#1d4ed8",
    accentText: "#ffffff",
    success: "#12b76a",
    warning: "#f79009",
    danger: "#f04438",
    info: "#0ea5e9",
    overlay: "rgba(15, 23, 42, 0.48)"
  },
  space: {
    xxs: "0.25rem",
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
    xxl: "2rem",
    xxxl: "3rem"
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    pill: "999px",
    round: "50%"
  },
  shadow: {
    soft: "0 2px 10px rgba(15, 23, 42, 0.06)",
    medium: "0 8px 24px rgba(15, 23, 42, 0.10)",
    strong: "0 16px 40px rgba(15, 23, 42, 0.14)"
  },
  typography: {
    fontFamilyBody:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontFamilyMono:
      '"SFMono-Regular", ui-monospace, "Cascadia Code", "Roboto Mono", Consolas, monospace',
    fontSizeXs: "0.75rem",
    fontSizeSm: "0.875rem",
    fontSizeMd: "1rem",
    fontSizeLg: "1.125rem",
    fontSizeXl: "1.375rem",
    fontSizeXxl: "1.75rem",
    fontWeightRegular: "400",
    fontWeightMedium: "500",
    fontWeightSemibold: "600",
    fontWeightBold: "700",
    lineHeightTight: "1.2",
    lineHeightBase: "1.5",
    lineHeightRelaxed: "1.65"
  },
  size: {
    topBarHeight: "3.75rem",
    bottomNavHeight: "4.5rem",
    screenMaxWidth: "48rem",
    iconSm: "1rem",
    iconMd: "1.25rem",
    iconLg: "1.5rem"
  },
  motion: {
    durationFast: "140ms",
    durationBase: "220ms",
    durationSlow: "320ms",
    easingStandard: "cubic-bezier(0.2, 0, 0, 1)"
  },
  zIndex: {
    base: "0",
    header: "10",
    bottomNav: "20",
    modal: "40",
    toast: "50"
  }
});