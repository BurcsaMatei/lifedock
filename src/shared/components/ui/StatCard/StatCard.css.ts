import { style } from "@vanilla-extract/css";

import { vars } from "../../../theme/contract.css";

export const root = style({
  display: "grid",
  gap: vars.space.xs,
  padding: vars.space.md,
  borderRadius: vars.radius.xl,
  backgroundColor: vars.color.backgroundSurface,
  border: `1px solid ${vars.color.borderSoft}`,
  boxShadow: vars.shadow.soft
});

export const label = style({
  fontSize: vars.typography.fontSizeXs,
  fontWeight: vars.typography.fontWeightMedium,
  color: vars.color.textMuted,
  textTransform: "uppercase",
  letterSpacing: "0.04em"
});

export const value = style({
  fontSize: vars.typography.fontSizeXxl,
  fontWeight: vars.typography.fontWeightBold,
  color: vars.color.textPrimary,
  lineHeight: vars.typography.lineHeightTight
});

export const helper = style({
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textSecondary
});