import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../../theme/contract.css";

export const base = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "1.75rem",
  padding: `0 ${vars.space.sm}`,
  borderRadius: vars.radius.pill,
  fontSize: vars.typography.fontSizeXs,
  fontWeight: vars.typography.fontWeightSemibold,
  lineHeight: 1,
  whiteSpace: "nowrap"
});

export const tone = styleVariants({
  neutral: {
    backgroundColor: vars.color.backgroundCanvas,
    color: vars.color.textSecondary
  },
  info: {
    backgroundColor: "rgba(14, 165, 233, 0.10)",
    color: vars.color.info
  },
  success: {
    backgroundColor: "rgba(18, 183, 106, 0.10)",
    color: vars.color.success
  },
  warning: {
    backgroundColor: "rgba(247, 144, 9, 0.10)",
    color: vars.color.warning
  },
  danger: {
    backgroundColor: "rgba(240, 68, 56, 0.10)",
    color: vars.color.danger
  }
});