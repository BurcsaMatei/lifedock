import { style } from "@vanilla-extract/css";

import { vars } from "../../../theme/contract.css";

export const field = style({
  display: "grid",
  gap: vars.space.xs
});

export const label = style({
  fontSize: vars.typography.fontSizeSm,
  fontWeight: vars.typography.fontWeightSemibold,
  color: vars.color.textPrimary
});

export const control = style({
  width: "100%",
  minHeight: "2.75rem",
  padding: `0 ${vars.space.md}`,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.borderSoft}`,
  backgroundColor: vars.color.backgroundSurface,
  color: vars.color.textPrimary,
  fontSize: vars.typography.fontSizeMd,
  lineHeight: vars.typography.lineHeightBase,
  appearance: "none",
  selectors: {
    "&:hover": {
      borderColor: vars.color.borderStrong
    },
    "&:focus": {
      outline: "none",
      borderColor: vars.color.accent,
      boxShadow: `0 0 0 3px rgba(37, 99, 235, 0.16)`
    },
    "&:disabled": {
      opacity: 0.64,
      cursor: "not-allowed",
      backgroundColor: vars.color.backgroundCanvas
    }
  }
});

export const controlError = style({
  borderColor: vars.color.danger
});

export const hint = style({
  fontSize: vars.typography.fontSizeXs,
  color: vars.color.textMuted
});

export const error = style({
  fontSize: vars.typography.fontSizeXs,
  color: vars.color.danger,
  fontWeight: vars.typography.fontWeightMedium
});