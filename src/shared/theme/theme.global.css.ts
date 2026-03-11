import { globalStyle } from "@vanilla-extract/css";

import { vars } from "./contract.css";

globalStyle("html", {
  WebkitTextSizeAdjust: "100%",
  textRendering: "optimizeLegibility",
  MozOsxFontSmoothing: "grayscale",
  WebkitFontSmoothing: "antialiased"
});

globalStyle("html, body", {
  margin: 0,
  padding: 0,
  minHeight: "100%"
});

globalStyle("body", {
  backgroundColor: vars.color.backgroundCanvas,
  color: vars.color.textPrimary,
  fontFamily: vars.typography.fontFamilyBody,
  fontSize: vars.typography.fontSizeMd,
  lineHeight: vars.typography.lineHeightBase
});

globalStyle("*", {
  boxSizing: "border-box"
});

globalStyle("a", {
  color: "inherit",
  textDecoration: "none"
});

globalStyle("button, input, select, textarea", {
  font: "inherit"
});

globalStyle("button", {
  border: "none",
  background: "none",
  cursor: "pointer"
});

globalStyle("img", {
  display: "block",
  maxWidth: "100%"
});

globalStyle("ul, ol", {
  margin: 0,
  padding: 0,
  listStyle: "none"
});

globalStyle("h1, h2, h3, h4, h5, h6, p", {
  margin: 0
});

globalStyle("main", {
  display: "block"
});

globalStyle("::selection", {
  backgroundColor: vars.color.accent,
  color: vars.color.accentText
});