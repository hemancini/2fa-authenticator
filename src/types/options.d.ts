type DefaultColor = "#619f04";

type ThemeMode = "dark" | "light" | "system";

type DefaultColors = [
  { name: "White"; main: "#fafafa" },
  { name: "Green"; main: "#619f04" },
  { name: "Orange"; main: "#ed6c02" },
  { name: "Purple"; main: "#9c27b0" },
  { name: "Deep Purple"; main: "#673ab7" },
  { name: "Purple Pain"; main: "#8458B3" },
  { name: "Indigo"; main: "#3f51b5" },
  { name: "Blue"; main: "#2196f3" },
  { name: "Blue Grey"; main: "#607d8b" },
  { name: "Teal"; main: "#009688" }
];

type DefaultColorNames = DefaultColors[number]["name"];
type DefaultColorHexes = DefaultColors[number]["main"];

interface OptionsStore {
  themeMode: ThemeMode;
  toggleThemeMode: (mode: ThemeMode) => void;
  themeColor: DefaultColorHexes;
  toggleThemeColor: (color: DefaultColorHexes) => void;
  tooltipEnabled: boolean;
  toggleTooltipEnabled: () => void;
  bypassEnabled: boolean;
  toggleBypassEnabled: () => void;
  autofillEnabled: boolean;
  toggleAutofillEnabled: () => void;
  xraysEnabled: boolean;
  toggleXraysEnabled: () => void;
  isVisibleTokens: boolean;
  toggleVisibleTokens: () => void;
  useLegacyEntryCard?: boolean;
  toggleUseLegacyEntryCard?: () => void;
  useLegacyAddEntryMenu?: boolean;
  toggleUseLegacyAddEntryMenu?: () => void;
  useGoogleBackup?: boolean;
  toggleGoogleBackup?: () => void;
}
