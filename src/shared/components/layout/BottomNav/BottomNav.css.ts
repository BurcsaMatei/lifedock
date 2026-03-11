import { style } from "@vanilla-extract/css";

import { vars } from "../../../theme/contract.css";

export const nav = style({
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: vars.zIndex.bottomNav,
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  alignItems: "stretch",
  minHeight: `calc(${vars.size.bottomNavHeight} + env(safe-area-inset-bottom))`,
  paddingBottom: "env(safe-area-inset-bottom)",
  backgroundColor: vars.color.backgroundSurfaceRaised,
  borderTop: `1px solid ${vars.color.borderSoft}`,
  boxShadow: vars.shadow.medium
});

export const link = style({
  minHeight: vars.size.bottomNavHeight,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: `${vars.space.sm} ${vars.space.xs}`,
  fontSize: vars.typography.fontSizeSm,
  fontWeight: vars.typography.fontWeightMedium,
  color: vars.color.textMuted,
  transition: `color ${vars.motion.durationFast} ${vars.motion.easingStandard}`
});

export const linkActive = style({
  color: vars.color.accent
});