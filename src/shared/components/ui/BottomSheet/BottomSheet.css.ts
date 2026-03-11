import { style } from "@vanilla-extract/css";

import { vars } from "../../../theme/contract.css";

export const overlay = style({
  position: "fixed",
  inset: 0,
  zIndex: vars.zIndex.modal,
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  padding: vars.space.sm,
  backgroundColor: vars.color.overlay
});

export const panel = style({
  width: "100%",
  maxWidth: vars.size.screenMaxWidth,
  maxHeight: "min(80dvh, 42rem)",
  overflow: "auto",
  display: "grid",
  gap: vars.space.md,
  padding: `${vars.space.lg} ${vars.space.md} calc(${vars.space.lg} + env(safe-area-inset-bottom))`,
  borderTopLeftRadius: vars.radius.xl,
  borderTopRightRadius: vars.radius.xl,
  backgroundColor: vars.color.backgroundSurfaceRaised,
  boxShadow: vars.shadow.strong
});

export const handle = style({
  width: "3rem",
  height: "0.3125rem",
  margin: `0 auto ${vars.space.sm}`,
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.borderStrong
});

export const header = style({
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

export const content = style({
  display: "grid",
  gap: vars.space.md
});