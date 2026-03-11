import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css";

export const root = style({
  display: "grid",
  gap: vars.space.xl
});

export const toolbar = style({
  display: "grid",
  gap: vars.space.md
});

export const list = style({
  display: "grid",
  gap: vars.space.md
});

export const card = style({
  display: "grid",
  gap: vars.space.md,
  padding: vars.space.md,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.borderSoft}`,
  backgroundColor: vars.color.backgroundSurface,
  boxShadow: vars.shadow.soft
});

export const cardTop = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: vars.space.md
});

export const cardHeading = style({
  display: "grid",
  gap: vars.space.xs
});

export const title = style({
  fontSize: vars.typography.fontSizeLg,
  fontWeight: vars.typography.fontWeightSemibold,
  color: vars.color.textPrimary,
  lineHeight: vars.typography.lineHeightTight
});

export const description = style({
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textSecondary,
  lineHeight: vars.typography.lineHeightRelaxed
});

export const metaRow = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.sm
});

export const subtle = style({
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textMuted
});

export const actionLink = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "2.75rem",
  padding: `0 ${vars.space.md}`,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.accent,
  color: vars.color.accentText,
  fontSize: vars.typography.fontSizeSm,
  fontWeight: vars.typography.fontWeightSemibold,
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.accentHover
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: "2px"
    }
  }
});