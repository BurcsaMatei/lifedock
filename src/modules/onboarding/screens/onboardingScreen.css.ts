import { style } from "@vanilla-extract/css";

import { vars } from "../../../shared/theme/contract.css";

export const stack = style({
  display: "grid",
  gap: vars.space.md
});

export const cardGrid = style({
  display: "grid",
  gap: vars.space.md
});

export const optionCard = style({
  display: "grid",
  gap: vars.space.sm,
  padding: vars.space.md,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.borderSoft}`,
  backgroundColor: vars.color.backgroundSurface
});

export const optionTitle = style({
  fontSize: vars.typography.fontSizeLg,
  fontWeight: vars.typography.fontWeightSemibold,
  color: vars.color.textPrimary
});

export const optionDescription = style({
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textSecondary,
  lineHeight: vars.typography.lineHeightRelaxed
});

export const checklist = style({
  display: "grid",
  gap: vars.space.sm
});

export const actions = style({
  display: "grid",
  gap: vars.space.md
});

export const helper = style({
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textSecondary
});