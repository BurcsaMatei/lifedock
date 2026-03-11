import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../../theme/contract.css";

export const base = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "1.75rem",
  padding: `0 ${vars.space.sm}`,
  borderRadius: vars.radius.pill,
  border: `1px solid transparent`,
  fontSize: vars.typography.fontSizeXs,
  fontWeight: vars.typography.fontWeightSemibold,
  lineHeight: 1,
  whiteSpace: "nowrap"
});

export const tone = styleVariants({
  neutral: {
    backgroundColor: vars.color.backgroundCanvas,
    borderColor: vars.color.borderSoft,
    color: vars.color.textSecondary
  },
  accent: {
    backgroundColor: "rgba(37, 99, 235, 0.08)",
    borderColor: "rgba(37, 99, 235, 0.18)",
    color: vars.color.accent
  },
  success: {
    backgroundColor: "rgba(18, 183, 106, 0.10)",
    borderColor: "rgba(18, 183, 106, 0.18)",
    color: vars.color.success
  },
  warning: {
    backgroundColor: "rgba(247, 144, 9, 0.10)",
    borderColor: "rgba(247, 144, 9, 0.18)",
    color: vars.color.warning
  },
  danger: {
    backgroundColor: "rgba(240, 68, 56, 0.10)",
    borderColor: "rgba(240, 68, 56, 0.18)",
    color: vars.color.danger
  }
});