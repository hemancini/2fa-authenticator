import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { esES } from "@mui/material/locale";
import { createTheme, StyledEngineProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DEFAULT_COLORS } from "@src/config";
import { useOptionsStore } from "@src/stores/useOptions";
import { useCallback } from "react";

export function theme() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const { themeColor, themeMode = "system" } = useOptionsStore();

  const color = Object.values(DEFAULT_COLORS).find((c) => c.main === themeColor);

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
