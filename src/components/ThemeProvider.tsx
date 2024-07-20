import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { esES } from "@mui/material/locale";
import { createTheme, StyledEngineProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useOptionsStore } from "@src/stores/useOptions";
import { useCallback } from "react";

const colors = {
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

export function theme() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const { themeColor, themeMode = "system" } = useOptionsStore();

  const color = Object.values(colors).find((c) => c.main === themeColor);

  return createTheme(
    {
      palette: {
        mode: themeMode === "system" ? (prefersDarkMode ? "dark" : "light") : themeMode ?? "dark",
        primary: { ...color },
        secondary: { ...color },
      },
    },
    esES
  );
}

export default function ThemeProvider({ children }: { children: JSX.Element }) {
  const useTheme = useCallback(() => theme(), [theme]);
  return (
    <EmotionThemeProvider theme={useTheme()}>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        {children}
      </StyledEngineProvider>
    </EmotionThemeProvider>
  );
}
