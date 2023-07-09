import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Options } from "@src/models/options";
import { createContext, ReactNode, useMemo, useState } from "react";

const OptionsContext = createContext({
  toggleThemeMode: (mode: ThemeMode) => void 0,
  toggleThemeColor: (color: DefaultColorHexes) => void 0,
  toggleTooltipEnabled: () => void 0,
  toogleBypassEnabled: () => void 0,
  defaultColor: DEFAULT_COLOR as DefaultColorHexes,
  defaultMode: DEFAULT_MODE as ThemeMode,
  tooltipEnabled: true,
  bypassEnabled: false,
  xraysEnabled: false,
});

export function OptionsProvider({ children }: { children: ReactNode }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [options, setOptions] = useState<Options>(undefined);

  const handlerOptions = useMemo(
    () => ({
      toggleThemeMode: (mode?: ThemeMode) => {
        setOptions((prevOptions: React.SetStateAction<any>) => ({
          ...prevOptions,
          themeMode: mode,
        }));
      },
      toggleThemeColor: (color: DefaultColorHexes) => {
        setOptions((prevOptions: React.SetStateAction<any>) => ({
          ...prevOptions,
          themeColor: color,
        }));
      },
      toggleTooltipEnabled: () => {
        setOptions((prevOptions: React.SetStateAction<any>) => ({
          ...prevOptions,
          tooltipEnabled: !prevOptions?.tooltipEnabled,
        }));
      },
      toogleBypassEnabled: () => {
        setOptions((prevOptions: React.SetStateAction<any>) => ({
          ...prevOptions,
          bypassEnabled: !prevOptions?.bypassEnabled,
        }));
      },
    }),
    []
  );

  const theme = useMemo(() => {
    (async () => {
      if (
        !options?.themeMode ||
        !options?.themeColor ||
        options?.tooltipEnabled === undefined ||
        options?.bypassEnabled === undefined ||
        options?.xraysEnabled === undefined
      ) {
        const initOptions = await Options.getOptions();
        initOptions.themeColor = initOptions.themeColor || DEFAULT_COLOR;
        initOptions.themeMode = initOptions.themeMode || DEFAULT_MODE;
        initOptions.tooltipEnabled = initOptions?.tooltipEnabled === undefined || initOptions.tooltipEnabled === true;
        initOptions.bypassEnabled = initOptions?.bypassEnabled !== undefined && initOptions.bypassEnabled === true;
        initOptions.xraysEnabled = initOptions?.xraysEnabled !== undefined && initOptions.xraysEnabled === true;
        setOptions(initOptions);
      } else {
        await Options.setOptions({ ...options });
      }
    })();

    const themeMode: ThemeMode = options?.themeMode;
    const isDarkMode = themeMode === "dark" || (themeMode === DEFAULT_MODE && prefersDarkMode);

    return createTheme({
      // spacing: [5, 7],
      palette: {
        mode: isDarkMode ? "dark" : "light",
        primary: { main: options?.themeColor || DEFAULT_COLOR },
        secondary: { main: options?.themeColor || DEFAULT_COLOR },
      },
    });
  }, [options]);

  return (
    <OptionsContext.Provider
      value={{
        ...handlerOptions,
        xraysEnabled: options?.xraysEnabled,
        bypassEnabled: options?.bypassEnabled,
        tooltipEnabled: options?.tooltipEnabled,
        defaultColor: options?.themeColor,
        defaultMode: options?.themeMode,
      }}
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
