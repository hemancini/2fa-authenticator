// import { PaletteMode } from "@mui/material";

type DefaultColor = "#619f04";

// type ThemeMode = PaletteMode | "system";
type ThemeMode = "dark" | "light" | "system";

type DefaultColors = [
  { name: "Green"; hex: "#619f04" },
  { name: "Orange"; hex: "#ed6c02" },
  { name: "Purple"; hex: "#9c27b0" },
  { name: "Deep Purple"; hex: "#673ab7" },
  { name: "Indigo"; hex: "#3f51b5" },
  { name: "Blue"; hex: "#2196f3" },
  { name: "Blue Grey"; hex: "#607d8b" },
  { name: "Teal"; hex: "#009688" }
];

type DefaultColorNames = DefaultColors[number]["name"];
type DefaultColorHexes = DefaultColors[number]["hex"];

interface OptionsInterface {
  themeMode: ThemeMode;
  themeColor: DefaultColorHexes;
}
