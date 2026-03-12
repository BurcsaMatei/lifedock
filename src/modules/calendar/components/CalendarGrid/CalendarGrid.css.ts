import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../../../../shared/theme/contract.css";

export const wrapper = style({
  width: "100%"
});

export const chipContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  marginTop: "4px",
  width: "100%"
});

// react-calendar global overrides scoped to wrapper
globalStyle(`${wrapper} .react-calendar`, {
  width: "100%",
  border: `1px solid ${vars.color.borderSoft}`,
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.backgroundSurface,
  fontFamily: vars.typography.fontFamilyBody,
  lineHeight: vars.typography.lineHeightBase,
  overflow: "hidden"
});

globalStyle(`${wrapper} .react-calendar__navigation`, {
  display: "flex",
  alignItems: "center",
  padding: `${vars.space.sm} ${vars.space.sm}`,
  borderBottom: `1px solid ${vars.color.borderSoft}`,
  marginBottom: 0
});

globalStyle(`${wrapper} .react-calendar__navigation button`, {
  minWidth: "2.25rem",
  height: "2.25rem",
  background: "none",
  border: "none",
  borderRadius: vars.radius.md,
  cursor: "pointer",
  padding: `0 ${vars.space.xs}`,
  color: vars.color.textPrimary,
  fontFamily: vars.typography.fontFamilyBody,
  fontSize: vars.typography.fontSizeSm,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});

globalStyle(`${wrapper} .react-calendar__navigation button:hover`, {
  backgroundColor: vars.color.backgroundCanvas
});

globalStyle(`${wrapper} .react-calendar__navigation button:disabled`, {
  opacity: "0.4",
  cursor: "default"
});

globalStyle(`${wrapper} .react-calendar__navigation__label`, {
  flex: "1",
  fontSize: vars.typography.fontSizeMd,
  fontWeight: vars.typography.fontWeightSemibold,
  color: vars.color.textPrimary,
  textAlign: "center",
  cursor: "default"
});

globalStyle(`${wrapper} .react-calendar__navigation__label:hover`, {
  backgroundColor: "transparent",
  cursor: "default"
});

globalStyle(`${wrapper} .react-calendar__month-view`, {
  padding: vars.space.xs
});

globalStyle(`${wrapper} .react-calendar__month-view__weekdays`, {
  textAlign: "center",
  marginBottom: vars.space.xxs
});

globalStyle(`${wrapper} .react-calendar__month-view__weekdays__weekday`, {
  padding: `${vars.space.xxs} 0`,
  fontSize: vars.typography.fontSizeXs,
  fontWeight: vars.typography.fontWeightMedium,
  color: vars.color.textMuted
});

globalStyle(`${wrapper} .react-calendar__month-view__weekdays abbr`, {
  textDecoration: "none"
});

globalStyle(`${wrapper} .react-calendar__month-view__days__day`, {
  position: "relative"
});

globalStyle(`${wrapper} .react-calendar__tile`, {
  background: "none",
  border: "1px solid transparent",
  borderRadius: vars.radius.md,
  cursor: "pointer",
  padding: `${vars.space.xs} ${vars.space.xxs}`,
  minHeight: "5.5rem",
  textAlign: "left",
  color: vars.color.textPrimary,
  fontSize: vars.typography.fontSizeSm,
  fontFamily: vars.typography.fontFamilyBody,
  display: "block",
  boxSizing: "border-box",
  width: "100%"
});

globalStyle(`${wrapper} .react-calendar__tile:hover`, {
  borderColor: vars.color.accent,
  backgroundColor: "rgba(37, 99, 235, 0.06)"
});

globalStyle(`${wrapper} .react-calendar__tile abbr`, {
  fontSize: vars.typography.fontSizeSm,
  fontWeight: vars.typography.fontWeightMedium,
  display: "block"
});

globalStyle(`${wrapper} .react-calendar__tile--now`, {
  backgroundColor: "rgba(37, 99, 235, 0.1)"
});

globalStyle(`${wrapper} .react-calendar__tile--now abbr`, {
  color: vars.color.accent,
  fontWeight: vars.typography.fontWeightBold
});

globalStyle(`${wrapper} .react-calendar__tile--active`, {
  backgroundColor: vars.color.accent,
  color: vars.color.accentText
});

globalStyle(`${wrapper} .react-calendar__tile--active:hover`, {
  backgroundColor: vars.color.accentHover
});

globalStyle(`${wrapper} .react-calendar__tile--active abbr`, {
  color: vars.color.accentText
});

globalStyle(`${wrapper} .react-calendar__month-view__days__day--neighboringMonth`, {
  opacity: "0.35"
});

globalStyle(`${wrapper} .react-calendar__month-view__days__day--weekend`, {
  color: vars.color.danger
});

globalStyle(`${wrapper} .react-calendar__tile--active.react-calendar__month-view__days__day--weekend`, {
  color: vars.color.accentText
});
