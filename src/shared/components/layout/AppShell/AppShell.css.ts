import { style } from "@vanilla-extract/css";

import { vars } from "../../../theme/contract.css";

export const shell = style({
  minHeight: "100dvh",
  display: "flex",
  flexDirection: "column"
});

export const content = style({
  flex: 1,
  paddingBottom: `calc(${vars.size.bottomNavHeight} + env(safe-area-inset-bottom))`
});