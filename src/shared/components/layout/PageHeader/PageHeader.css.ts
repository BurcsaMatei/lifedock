import { style } from "@vanilla-extract/css";

import { vars } from "../../../theme/contract.css";

export const root = style({
  display: "grid",
  gap: vars.space.sm
});

export const eyebrow = style({
  fontSize: vars.typography.fontSizeXs,
  fontWeight: vars.typography.fontWeightSemibold,
  color: vars.color.accent,
  textTransform: "uppercase",
  letterSpacing: "0.06em"
});

export const title = style({
  fontSize: vars.typography.fontSizeXxl,
  fontWeight: vars.typography.fontWeightBold,
  color: vars.color.textPrimary,
  lineHeight: vars.typography.lineHeightTight
});

export const description = style({
  fontSize: vars.typography.fontSizeMd,
  color: vars.color.textSecondary,
  lineHeight: vars.typography.lineHeightRelaxed,
  maxWidth: "42rem"
});

export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.sm,
  marginTop: vars.space.xs
});