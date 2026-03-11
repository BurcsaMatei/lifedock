import { style } from "@vanilla-extract/css";

import { vars } from "../../../theme/contract.css";

export const overlay = style({
  position: "fixed",
  inset: 0,
  zIndex: vars.zIndex.modal,
  display: "grid",
  placeItems: "center",
  padding: vars.space.md,
  backgroundColor: vars.color.overlay
});

export const panel = style({
  width: "100%",
  maxWidth: "32rem",
  maxHeight: "min(85dvh, 42rem)",
  overflow: "auto",
  display: "grid",
  gap: vars.space.md,
  padding: vars.space.lg,
  borderRadius: vars.radius.xl,
  backgroundColor: vars.color.backgroundSurfaceRaised,
  boxShadow: vars.shadow.strong
});

export const header = style({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: vars.space.md
});

export const headerText = style({
  display: "grid",
  gap: vars.space.xs
});

export const title = style({
  fontSize: vars.typography.fontSizeLg,
  fontWeight: vars.typography.fontWeightBold,
  color: vars.color.textPrimary
});

export const description = style({
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textSecondary,
  lineHeight: vars.typography.lineHeightRelaxed
});

export const closeButton = style({
  minWidth: "2.25rem",
  minHeight: "2.25rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: vars.radius.round,
  color: vars.color.textSecondary,
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.backgroundCanvas
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: "2px"
    }
  }
});

export const content = style({
  display: "grid",
  gap: vars.space.md
});

export const footer = style({
  display: "flex",
  justifyContent: "flex-end",
  gap: vars.space.sm
});