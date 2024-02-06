import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { t } from "@src/chrome/i18n";
import React from "react";

import { useOptionsStore } from '@src/stores/useOptionsStore';
import Tooltip from "../Tooltip";

export default function ToggleThemeMode() {
  const { themeMode, toggleThemeMode } = useOptionsStore();

  const handleChange = (_event: React.MouseEvent<HTMLElement>, themeMode: ThemeMode) => {
    toggleThemeMode(themeMode);
  };

  const iconSize = { sx: { fontSize: 20 } } as const;

  return (
    <ToggleButtonGroup
      fullWidth
      exclusive
      size="small"
      color={"primary"}
      value={themeMode}
      aria-label="theme mode"
      onChange={handleChange}
      sx={{
        m: 1,
        mb: 0.5,
        '& .MuiToggleButton-root': {
          py: 0.3,
          px: 0.7,
        },
      }}
    >
      <ToggleButton value="light" size="small">
        <Tooltip title={t("lightMode")} disableInteractive>
          <LightModeIcon {...iconSize} />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="system" size="small">
        <Tooltip title={t("systemMode")} disableInteractive>
          <SettingsBrightnessIcon {...iconSize} />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="dark" size="small">
        <Tooltip title={t("darkMode")} disableInteractive>
          <DarkModeIcon {...iconSize} />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
