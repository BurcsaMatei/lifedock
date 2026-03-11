import { style } from "@vanilla-extract/css";

import { vars } from "../../../../shared/theme/contract.css";

export const root = style({
  display: "grid",
  gap: vars.space.xl
});

export const content = style({
  display: "grid",
  gap: vars.space.md
});

export const summary = style({
  display: "grid",
  gap: vars.space.sm,
  padding: vars.space.md,
  border: "1px solid rgba(15, 23, 42, 0.08)",
  borderRadius: 16,
  background: "rgba(15, 23, 42, 0.02)"
});

export const metaList = style({
  display: "grid",
  gap: vars.space.sm
});

export const metaRow = style({
  display: "grid",
  gap: 4
});

export const label = style({
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textSecondary,
  lineHeight: vars.typography.lineHeightRelaxed
});

export const value = style({
  margin: 0
});

export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.sm
});

export const subtle = style({
  margin: 0,
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textSecondary,
  lineHeight: vars.typography.lineHeightRelaxed
});

export const dangerZone = style({
  display: "grid",
  gap: vars.space.sm,
  paddingTop: vars.space.md,
  borderTop: "1px solid rgba(15, 23, 42, 0.08)"
});

export const textAction = style({
  appearance: "none",
  border: 0,
  background: "transparent",
  padding: 0,
  cursor: "pointer",
  textDecoration: "underline",
  font: "inherit",
  color: "inherit",
  textAlign: "left"
});