import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Options } from "@src/models/options";
import { createContext, ReactNode, useMemo, useState } from "react";

const OptionsContext = createContext({
  toggleColorMode: (mode: ThemeMode) => void 0,
  toggleThemeColor: (color: DefaultColorHexes) => void 0,
  defaultColor: DEFAULT_COLOR as DefaultColorHexes,
  defaultMode: DEFAULT_MODE as ThemeMode,
});

export function OptionsProvider({ children }: { children: ReactNode }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [options, setOptions] = useState<Options | undefined>(undefined);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: (mode?: ThemeMode) => {
        setOptions((prevMode: any) => ({
          ...prevMode,
          themeMode: mode,
        }));
      },
      toggleThemeColor: (color: any) => {
        setOptions((prevColor) => ({
          ...prevColor,
          themeColor: color,
        }));
      },
    }),
    []
  );

  const theme = useMemo(() => {
    (async () => {
      const { themeMode = DEFAULT_MODE, themeColor = DEFAULT_COLOR }: any = await Options.getOptions();
      if (!options?.themeMode || !options?.themeColor) {
        setOptions({ themeMode: themeMode, themeColor });
      } else {
        await Options.setOptions({ ...options });
      }
    })();

    const themeMode: ThemeMode = options?.themeMode;
    const isDarkMode = themeMode === "dark" || (themeMode === DEFAULT_MODE && prefersDarkMode);

    return createTheme({
      palette: {
        mode: isDarkMode ? "dark" : "light",
        primary: { main: options?.themeColor || DEFAULT_COLOR },
        secondary: { main: options?.themeColor || DEFAULT_COLOR },
      },
    });
  }, [options]);

  return (
    <OptionsContext.Provider
      value={{ ...colorMode, defaultColor: options?.themeColor, defaultMode: options?.themeMode }}
    >
      {options?.themeMode && options?.themeColor && (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      )}
    </OptionsContext.Provider>
  );
}

export default OptionsContext;
