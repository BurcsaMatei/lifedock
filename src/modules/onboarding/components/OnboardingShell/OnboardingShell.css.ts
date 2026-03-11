import { style } from "@vanilla-extract/css";

import { vars } from "../../../../shared/theme/contract.css";

export const root = style({
  display: "grid",
  gap: vars.space.xl,
  paddingTop: vars.space.xl
});

export const surface = style({
  display: "grid",
  gap: vars.space.lg,
  padding: vars.space.lg,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.borderSoft}`,
  backgroundColor: vars.color.backgroundSurface,
  boxShadow: vars.shadow.soft
});

export const content = style({
  display: "grid",
  gap: vars.space.lg
});

export const footer = style({
  display: "grid",
  gap: vars.space.sm
});