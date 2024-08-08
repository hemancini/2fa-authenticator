import CustomSwitch from "@components/CustomSwitch";
import Tooltip from "@components/CustomTooltip";
import { Avatar } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useScreenSize } from "@src/hooks/useScreenSize";

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
  icon?: JSX.Element;
}) {
  const { isUpSm } = useScreenSize();

  return (
    <ListItem disablePadding dense={!isUpSm}>
      <Tooltip title={tooltip ?? ""} disableInteractive>
        <ListItemButton dense={!isUpSm} onClick={toggleSwitch}>
          <CustomItemIcon>{icon ? icon : <Avatar sx={{ width: 24, height: 24 }} />}</CustomItemIcon>
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
