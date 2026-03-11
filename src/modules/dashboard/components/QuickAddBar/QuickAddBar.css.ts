import { style } from "@vanilla-extract/css";

import { vars } from "../../../../shared/theme/contract.css";

export const actionGrid = style({
  display: "grid",
  gap: vars.space.sm
});

export const actionLink = style({
  display: "grid",
  gap: vars.space.xxs,
  padding: vars.space.md,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.borderSoft}`,
  backgroundColor: vars.color.backgroundSurface,
  transition: [
    `border-color ${vars.motion.durationFast} ${vars.motion.easingStandard}`,
    `background-color ${vars.motion.durationFast} ${vars.motion.easingStandard}`
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

export const actionTitle = style({
  fontSize: vars.typography.fontSizeMd,
  fontWeight: vars.typography.fontWeightSemibold,
  color: vars.color.textPrimary
});

export const actionDescription = style({
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textSecondary,
  lineHeight: vars.typography.lineHeightRelaxed
});