import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import OptionsContext from "@src/contexts/Options";
import React, { useContext } from "react";

export default function ToggleThemeMode() {
  const { toggleThemeMode, defaultMode, defaultColor } = useContext(OptionsContext);
  const themeMode: ThemeMode = defaultMode;

  const handleChange = (_event: React.MouseEvent<HTMLElement>, themeMode: ThemeMode) => {
    toggleThemeMode(themeMode);
  };

  return (
    <ToggleButtonGroup
      fullWidth
      exclusive
      color={DEFAULT_COLORS[0].hex === defaultColor ? "standard" : "primary"}
      value={themeMode}
      aria-label="theme mode"
      onChange={handleChange}
      sx={{ m: 1, mb: 0.5 }}
    >
      <ToggleButton value="light">
        <LightModeIcon />
      </ToggleButton>
      <ToggleButton value="system">
        <SettingsBrightnessIcon />
      </ToggleButton>
      <ToggleButton value="dark">
        <DarkModeIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
