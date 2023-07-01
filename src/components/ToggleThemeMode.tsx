import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import OptionsProvider from "@src/contexts/Options";
import React, { useContext } from "react";

export default function ToggleThemeMode() {
  const { toggleColorMode, defaultMode } = useContext(OptionsProvider);
  const themeMode: ThemeMode = defaultMode;

  const handleChange = (_event: React.MouseEvent<HTMLElement>, themeMode: ThemeMode) => {
    toggleColorMode(themeMode);
  };

  return (
    <ToggleButtonGroup
      fullWidth
      exclusive
      size="small"
      color="primary"
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
