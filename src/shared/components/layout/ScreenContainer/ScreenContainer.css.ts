import { style } from "@vanilla-extract/css";

import { vars } from "../../../theme/contract.css";

export const root = style({
  width: "100%",
  maxWidth: vars.size.screenMaxWidth,
  margin: "0 auto",
  padding: `${vars.space.lg} ${vars.space.md}`
});