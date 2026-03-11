import { style } from "@vanilla-extract/css";

import { vars } from "../../../theme/contract.css";

export const root = style({
  position: "sticky",
  top: 0,
  zIndex: vars.zIndex.header,
  backgroundColor: vars.color.backgroundSurfaceRaised,
  borderBottom: `1px solid ${vars.color.borderSoft}`
});

export const inner = style({
  width: "100%",
  maxWidth: vars.size.screenMaxWidth,
  minHeight: vars.size.topBarHeight,
  margin: "0 auto",
  padding: `calc(env(safe-area-inset-top) + ${vars.space.sm}) ${vars.space.md} ${vars.space.sm}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.md
});

export const brand = style({
  fontSize: vars.typography.fontSizeLg,
  fontWeight: vars.typography.fontWeightBold,
  color: vars.color.textPrimary
});

export const meta = style({
  display: "grid",
  gap: vars.space.xxs
});

export const title = style({
  fontSize: vars.typography.fontSizeSm,
  fontWeight: vars.typography.fontWeightSemibold,
  color: vars.color.textSecondary
});

export const trailing = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm
});