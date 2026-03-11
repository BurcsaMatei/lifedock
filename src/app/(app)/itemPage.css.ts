import { style } from "@vanilla-extract/css";

import { vars } from "../../shared/theme/contract.css";

export const root = style({
  display: "grid",
  gap: vars.space.xl
});

export const form = style({
  display: "grid",
  gap: vars.space.md
});

export const actions = style({
  display: "flex",
  gap: vars.space.sm,
  flexWrap: "wrap"
});