import { style } from "treat";
import * as vars from "../../variables";

export const overlay = style({
  position: "fixed",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 1000000094,
});

export const modalContainer = style({
  width: "100%",
  height: "100%",
});

export const modal = style({
  maxHeight: `calc(100% - ${20 * vars.spaceUnit}px)`,
  maxWidth: `calc(100% - ${10 * vars.spaceUnit}px)`,
  backgroundColor: vars.white,
  borderRadius: vars.borderRadius,
});

export const header = style({
  padding: 6 * vars.spaceUnit,
  paddingBottom: 2 * vars.spaceUnit,
  fontWeight: 800,
});

export const dismissIcon = style({
  cursor: "pointer",
  color: vars.grey03,

  ":hover": {
    color: vars.grey02,
  },
});

export const content = style({
  paddingTop: vars.spaceUnit,
  paddingBottom: 4 * vars.spaceUnit,
  paddingLeft: 6 * vars.spaceUnit,
  paddingRight: 6 * vars.spaceUnit,
  overflowY: "auto",
});

export const emptyFooter = style({
  paddingTop: 4 * vars.spaceUnit,
});

export const footer = style({
  padding: 6 * vars.spaceUnit,
  paddingTop: 7 * vars.spaceUnit,
  paddingBottom: 7 * vars.spaceUnit,
  width: "100%",
  backgroundColor: vars.green02,
  borderBottomLeftRadius: vars.borderRadius,
  borderBottomRightRadius: vars.borderRadius,
});
