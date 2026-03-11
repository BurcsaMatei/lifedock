import { style } from "@vanilla-extract/css";

import { vars } from "../../../theme/contract.css";

export const list = style({
  display: "flex",
  gap: vars.space.sm,
  overflowX: "auto",
  paddingBottom: vars.space.xxs
});

export const trigger = style({
  minHeight: "2.5rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.space.xs,
  padding: `0 ${vars.space.md}`,
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.borderSoft}`,
  backgroundColor: vars.color.backgroundSurface,
  color: vars.color.textSecondary,
  fontSize: vars.typography.fontSizeSm,
  fontWeight: vars.typography.fontWeightSemibold,
  whiteSpace: "nowrap",
  transition: [
    `background-color ${vars.motion.durationFast} ${vars.motion.easingStandard}`,
    `border-color ${vars.motion.durationFast} ${vars.motion.easingStandard}`,
    `color ${vars.motion.durationFast} ${vars.motion.easingStandard}`
  ].join(", "),
  selectors: {
    "&:hover": {
      borderColor: vars.color.borderStrong,
      backgroundColor: vars.color.backgroundCanvas
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: "2px"
    }
  }
});

export const triggerActive = style({
  backgroundColor: vars.color.accent,
  borderColor: vars.color.accent,
  color: vars.color.accentText
});

export const badge = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "1.25rem",
  height: "1.25rem",
  padding: `0 ${vars.space.xs}`,
  borderRadius: vars.radius.pill,
  backgroundColor: "rgba(255, 255, 255, 0.18)",
  fontSize: vars.typography.fontSizeXs,
  lineHeight: 1
});