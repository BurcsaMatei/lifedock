import { style } from "@vanilla-extract/css";

import { vars } from "../../../../shared/theme/contract.css";

export const panel = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
  padding: vars.space.lg,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.borderSoft}`,
  backgroundColor: vars.color.backgroundSurface,
  boxShadow: vars.shadow.soft
});

export const panelHeader = style({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: vars.space.sm
});

export const panelTitle = style({
  fontSize: vars.typography.fontSizeMd,
  fontWeight: vars.typography.fontWeightSemibold,
  color: vars.color.textPrimary,
  lineHeight: vars.typography.lineHeightTight,
  textTransform: "capitalize"
});

export const closeButton = style({
  flexShrink: 0,
  width: "1.75rem",
  height: "1.75rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: vars.radius.md,
  color: vars.color.textMuted,
  fontSize: vars.typography.fontSizeSm,
  transition: `background-color ${vars.motion.durationFast} ${vars.motion.easingStandard}`,
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

export const emptyText = style({
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textMuted
});

export const itemList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs
});

export const itemLink = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.sm}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.borderSoft}`,
  backgroundColor: vars.color.backgroundSurface,
  transition: `border-color ${vars.motion.durationFast} ${vars.motion.easingStandard}, background-color ${vars.motion.durationFast} ${vars.motion.easingStandard}`,
  selectors: {
    "&:hover": {
      borderColor: vars.color.accent,
      backgroundColor: vars.color.backgroundCanvas
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: "2px"
    }
  }
});

export const itemBadge = style({
  flexShrink: 0,
  fontSize: "0.6875rem",
  fontWeight: vars.typography.fontWeightSemibold,
  padding: `2px ${vars.space.xs}`,
  borderRadius: vars.radius.pill,
  color: "#ffffff"
});

export const itemBadgeEvent = style({
  backgroundColor: vars.color.info
});

export const itemBadgeBill = style({
  backgroundColor: vars.color.danger
});

export const itemBadgeObligation = style({
  backgroundColor: vars.color.warning
});

export const itemBadgeDocument = style({
  backgroundColor: vars.color.success
});

export const itemTitle = style({
  fontSize: vars.typography.fontSizeSm,
  fontWeight: vars.typography.fontWeightMedium,
  color: vars.color.textPrimary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
});
