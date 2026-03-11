import { createGlobalThemeContract } from "@vanilla-extract/css";

export const vars = createGlobalThemeContract(
  {
    color: {
      backgroundCanvas: null,
      backgroundSurface: null,
      backgroundSurfaceRaised: null,
      borderSoft: null,
      borderStrong: null,
      textPrimary: null,
      textSecondary: null,
      textMuted: null,
      accent: null,
      accentHover: null,
      accentText: null,
      success: null,
      warning: null,
      danger: null,
      info: null,
      overlay: null
    },
    space: {
      xxs: null,
      xs: null,
      sm: null,
      md: null,
      lg: null,
      xl: null,
      xxl: null,
      xxxl: null
    },
    radius: {
      sm: null,
      md: null,
      lg: null,
      xl: null,
      pill: null,
      round: null
    },
    shadow: {
      soft: null,
      medium: null,
      strong: null
    },
    typography: {
      fontFamilyBody: null,
      fontFamilyMono: null,
      fontSizeXs: null,
      fontSizeSm: null,
      fontSizeMd: null,
      fontSizeLg: null,
      fontSizeXl: null,
      fontSizeXxl: null,
      fontWeightRegular: null,
      fontWeightMedium: null,
      fontWeightSemibold: null,
      fontWeightBold: null,
      lineHeightTight: null,
      lineHeightBase: null,
      lineHeightRelaxed: null
    },
    size: {
      topBarHeight: null,
      bottomNavHeight: null,
      screenMaxWidth: null,
      iconSm: null,
      iconMd: null,
      iconLg: null
    },
    motion: {
      durationFast: null,
      durationBase: null,
      durationSlow: null,
      easingStandard: null
    },
    zIndex: {
      base: null,
      header: null,
      bottomNav: null,
      modal: null,
      toast: null
    }
  },
  (_value, path) => `ld-${path.join("-")}`
);