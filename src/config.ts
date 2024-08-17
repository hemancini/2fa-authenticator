import manifest from "../manifest";

export const HASH_KEY = "MY_SUPER_SECRET_KEY";
export const DEFAULT_APP_KEY = "PAaD&z7XC_-WQE";
export const DEFAULT_POPUP_URL = `/${manifest.action.default_popup}`;
export const DEFAULT_SIDE_PANEL_URL = `/${manifest.side_panel.default_path}`;

export const STORAGE_OPTIONS_KEY = "options";
export const STORAGE_ENTRIES_KEY = "entries";
export const CHROME_STORAGE_AREA = "sync";

export const DEFAULT_COLOR = "#619f04";
export const DEFAULT_MODE = "system";
export const DEFAULT_COLORS = {
  White: {
    main: "#fafafa",
    light: "#ffffff",
    dark: "#f5f5f5",
  },
  Green: {
    main: "#619f04",
    light: "#8bc34a",
    dark: "#578f03",
  },
  Orange: {
    main: "#ed6c02",
    light: "#ffab40",
    dark: "#f57c00",
  },
  Purple: {
    main: "#9c27b0",
    light: "#ba68c8",
    dark: "#7b1fa2",
  },
  "Deep Purple": {
    main: "#673ab7",
    light: "#9575cd",
    dark: "#512da8",
  },
  "Purple Pain": {
    main: "#8458B3",
    light: "#a37fda",
    dark: "#5c007a",
  },
  Indigo: {
    main: "#3f51b5",
    light: "#7986cb",
    dark: "#303f9f",
  },
  Blue: {
    main: "#2196f3",
    light: "#64b5f6",
    dark: "#1976d2",
  },
  "Blue Grey": {
    main: "#607d8b",
    light: "#90a4ae",
    dark: "#455a64",
  },
  Teal: {
    main: "#009688",
    light: "#4db6ac",
    dark: "#00796b",
  },
};

export const IS_DEV = import.meta.env.VITE_IS_DEV === "true";
