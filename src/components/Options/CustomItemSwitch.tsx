import CustomSwitch from "@components/CustomSwitch";
import Tooltip from "@components/CustomTooltip";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import CustomItemIcon from "./CustomItemIcon";

export default function CustomItemSwitch({
  primary,
  tooltip,
  switchEnabled,
  toggleSwitch,
  icon,
}: {
  primary: string;
  tooltip?: string;
  switchEnabled: boolean;
  toggleSwitch: () => void;
  icon: JSX.Element;
}) {
  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <ListItem disablePadding dense={!isUpSm}>
      <Tooltip title={tooltip ?? ""} disableInteractive>
        <ListItemButton dense={!isUpSm} onClick={toggleSwitch}>
          <CustomItemIcon>{icon}</CustomItemIcon>
          <ListItemText primary={primary} />
          <div
            style={{
              position: "absolute",
              display: "flex",
              justifyContent: "flex-end",
              width: "93%",
            }}
          >
            <CustomSwitch checked={switchEnabled} />
          </div>
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
}
