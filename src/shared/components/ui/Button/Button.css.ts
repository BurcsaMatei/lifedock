import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../../theme/contract.css";

export const base = style({
  minHeight: "2.75rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.space.xs,
  padding: `0 ${vars.space.md}`,
  borderRadius: vars.radius.pill,
  border: `1px solid transparent`,
  fontSize: vars.typography.fontSizeSm,
  fontWeight: vars.typography.fontWeightSemibold,
  lineHeight: 1,
  transition: [
    `background-color ${vars.motion.durationFast} ${vars.motion.easingStandard}`,
    `border-color ${vars.motion.durationFast} ${vars.motion.easingStandard}`,
    `color ${vars.motion.durationFast} ${vars.motion.easingStandard}`,
    `opacity ${vars.motion.durationFast} ${vars.motion.easingStandard}`,
    `transform ${vars.motion.durationFast} ${vars.motion.easingStandard}`
  ].join(", "),
  selectors: {
    "&:hover": {
      transform: "translateY(-1px)"
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: "2px"
    },
    "&:disabled": {
      opacity: 0.56,
      cursor: "not-allowed",
      transform: "none"
    }
  }
});

export const variant = styleVariants({
  primary: {
    backgroundColor: vars.color.accent,
    color: vars.color.accentText,
    selectors: {
      "&:hover:not(:disabled)": {
        backgroundColor: vars.color.accentHover
      }
    }
  },
  secondary: {
    backgroundColor: vars.color.backgroundSurface,
    borderColor: vars.color.borderSoft,
    color: vars.color.textPrimary,
    selectors: {
      "&:hover:not(:disabled)": {
        borderColor: vars.color.borderStrong,
        backgroundColor: vars.color.backgroundCanvas
      }
    }
  },
  ghost: {
    backgroundColor: "transparent",
    color: vars.color.textPrimary,
    selectors: {
      "&:hover:not(:disabled)": {
        backgroundColor: vars.color.backgroundCanvas
      }
    }
  },
  danger: {
    backgroundColor: vars.color.danger,
    color: vars.color.accentText,
    selectors: {
      "&:hover:not(:disabled)": {
        opacity: 0.92
      }
    }
  }
});

export const size = styleVariants({
  sm: {
    minHeight: "2.25rem",
    padding: `0 ${vars.space.sm}`,
    fontSize: vars.typography.fontSizeXs
  },
  md: {},
  lg: {
    minHeight: "3rem",
    padding: `0 ${vars.space.lg}`,
    fontSize: vars.typography.fontSizeMd
  }
});

export const fullWidth = style({
  width: "100%"
});

export const loading = style({
  pointerEvents: "none"
});

export const label = style({
  whiteSpace: "nowrap"
});