import { style } from "@vanilla-extract/css";

import { vars } from "../../../../shared/theme/contract.css";

export const root = style({
  display: "grid",
  gap: vars.space.xl
});

export const layout = style({
  display: "grid",
  gap: vars.space.lg
});

export const calendarSection = style({
  width: "100%"
});

export const loadingText = style({
  fontSize: vars.typography.fontSizeSm,
  color: vars.color.textMuted
});
