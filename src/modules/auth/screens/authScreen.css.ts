import { style } from "@vanilla-extract/css";

import { vars } from "../../../shared/theme/contract.css";

export const form = style({
  display: "grid",
  gap: vars.space.md
});

export const linksRow = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.md,
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textSecondary
});

export const helper = style({
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textSecondary,
  lineHeight: vars.typography.lineHeightRelaxed
});