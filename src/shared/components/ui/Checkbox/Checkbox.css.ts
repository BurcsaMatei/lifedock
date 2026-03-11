import { style } from "@vanilla-extract/css";

import { vars } from "../../../theme/contract.css";

export const field = style({
  display: "grid",
  gap: vars.space.xs
});

export const row = style({
  display: "flex",
  alignItems: "flex-start",
  gap: vars.space.sm
});

export const control = style({
  width: "1.125rem",
  height: "1.125rem",
  marginTop: "0.125rem",
  accentColor: vars.color.accent
});

export const labelBlock = style({
  display: "grid",
  gap: vars.space.xxs
});

export const label = style({
  fontSize: vars.typography.fontSizeSm,
  fontWeight: vars.typography.fontWeightMedium,
  color: vars.color.textPrimary
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