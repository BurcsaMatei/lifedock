import { style } from "@vanilla-extract/css";

import { vars } from "../../../theme/contract.css";

export const root = style({
  display: "grid",
  gap: vars.space.sm,
  padding: vars.space.xl,
  borderRadius: vars.radius.xl,
  border: `1px dashed ${vars.color.borderStrong}`,
  backgroundColor: vars.color.backgroundSurface,
  boxShadow: vars.shadow.soft,
  textAlign: "center"
});

export const title = style({
  fontSize: vars.typography.fontSizeLg,
  fontWeight: vars.typography.fontWeightSemibold,
  color: vars.color.textPrimary
});

export const description = style({
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textSecondary,
  lineHeight: vars.typography.lineHeightRelaxed
});

export const action = style({
  marginTop: vars.space.xs,
  display: "flex",
  justifyContent: "center"
});