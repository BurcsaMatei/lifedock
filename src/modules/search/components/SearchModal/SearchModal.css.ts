import { style } from "@vanilla-extract/css";

import { vars } from "../../../../shared/theme/contract.css";

export const overlay = style({
  position: "fixed",
  inset: 0,
  zIndex: vars.zIndex.modal,
  display: "flex",
  flexDirection: "column",
  backgroundColor: vars.color.overlay,
  padding: vars.space.md,
  paddingTop: `calc(${vars.space.md} + env(safe-area-inset-top))`
});

export const panel = style({
  width: "100%",
  maxWidth: "40rem",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  maxHeight: "calc(100dvh - 2 * ${vars.space.md})",
  borderRadius: vars.radius.xl,
  backgroundColor: vars.color.backgroundSurfaceRaised,
  boxShadow: vars.shadow.strong,
  overflow: "hidden"
});

export const searchRow = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  padding: `${vars.space.md} ${vars.space.lg}`,
  borderBottom: `1px solid ${vars.color.borderSoft}`
});

export const searchInput = style({
  flex: 1,
  fontSize: vars.typography.fontSizeMd,
  color: vars.color.textPrimary,
  backgroundColor: "transparent",
  border: "none",
  outline: "none",
  selectors: {
    "&::placeholder": {
      color: vars.color.textMuted
    }
  }
});

export const closeButton = style({
  minWidth: "2.25rem",
  minHeight: "2.25rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  borderRadius: vars.radius.round,
  fontSize: vars.typography.fontSizeLg,
  color: vars.color.textSecondary,
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.backgroundCanvas,
      color: vars.color.textPrimary
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: "2px"
    }
  }
});

export const resultsArea = style({
  flex: 1,
  overflowY: "auto",
  padding: vars.space.md
});

export const stateMessage = style({
  padding: vars.space.lg,
  textAlign: "center",
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textMuted
});

export const group = style({
  marginBottom: vars.space.lg,
  selectors: {
    "&:last-child": {
      marginBottom: 0
    }
  }
});

export const groupHeader = style({
  fontSize: vars.typography.fontSizeXs,
  fontWeight: vars.typography.fontWeightSemibold,
  color: vars.color.textMuted,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: vars.space.xs,
  paddingLeft: vars.space.xs
});

export const resultList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xxs
});

export const resultItem = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xxs,
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  cursor: "pointer",
  textAlign: "left",
  width: "100%",
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

export const resultTitle = style({
  fontSize: vars.typography.fontSizeSm,
  fontWeight: vars.typography.fontWeightMedium,
  color: vars.color.textPrimary,
  lineHeight: vars.typography.lineHeightTight
});

export const resultSubtitle = style({
  fontSize: vars.typography.fontSizeXs,
  color: vars.color.textMuted
});

export const typeBadge = style({
  display: "inline-block",
  fontSize: vars.typography.fontSizeXs,
  fontWeight: vars.typography.fontWeightMedium,
  padding: `1px ${vars.space.xs}`,
  borderRadius: vars.radius.pill,
  marginRight: vars.space.xs
});
