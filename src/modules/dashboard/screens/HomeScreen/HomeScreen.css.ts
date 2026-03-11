import { style } from "@vanilla-extract/css";

import { vars } from "../../../../shared/theme/contract.css";

export const root = style({
  display: "grid",
  gap: vars.space.xl
});

export const statsGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
  gap: vars.space.md
});

export const section = style({
  display: "grid",
  gap: vars.space.md
});

export const sectionHeaderRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.md
});

export const sectionHeading = style({
  fontSize: vars.typography.fontSizeMd,
  fontWeight: vars.typography.fontWeightSemibold,
  color: vars.color.textPrimary
});

export const viewAllLink = style({
  fontSize: vars.typography.fontSizeSm,
  fontWeight: vars.typography.fontWeightMedium,
  color: vars.color.accent,
  whiteSpace: "nowrap",
  selectors: {
    "&:hover": {
      color: vars.color.accentHover
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: "2px",
      borderRadius: vars.radius.sm
    }
  }
});

export const itemList = style({
  display: "grid",
  gap: vars.space.sm
});

export const item = style({
  display: "grid",
  gap: vars.space.xs,
  padding: vars.space.md,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.borderSoft}`,
  backgroundColor: vars.color.backgroundSurface
});

export const itemHeader = style({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: vars.space.sm
});

export const itemTitle = style({
  fontSize: vars.typography.fontSizeSm,
  fontWeight: vars.typography.fontWeightSemibold,
  color: vars.color.textPrimary,
  lineHeight: vars.typography.lineHeightTight
});

export const itemMeta = style({
  fontSize: vars.typography.fontSizeXs,
  color: vars.color.textMuted
});

export const itemDetailLink = style({
  fontSize: vars.typography.fontSizeXs,
  fontWeight: vars.typography.fontWeightMedium,
  color: vars.color.accent,
  justifySelf: "start",
  selectors: {
    "&:hover": {
      color: vars.color.accentHover
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: "2px",
      borderRadius: vars.radius.sm
    }
  }
});

export const loadingText = style({
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textMuted
});
