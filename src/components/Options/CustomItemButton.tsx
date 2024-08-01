import Tooltip from "@components/CustomTooltip";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import CustomItemIcon from "./CustomItemIcon";

export default function CustomItemButton({
  primary,
  toolltip,
  handleButton,
  icon,
  isNewTab = false,
}: {
  primary: string;
  toolltip?: string;
  handleButton: () => void;
  icon: JSX.Element;
  isNewTab?: boolean;
}) {
  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <ListItem disablePadding>
      <Tooltip title={toolltip ?? ""} disableInteractive>
        <ListItemButton dense={!isUpSm} onClick={handleButton}>
          <CustomItemIcon>{icon}</CustomItemIcon>
          <ListItemText primary={primary} />
          {isNewTab && (
            <div
              style={{
                position: "absolute",
                display: "flex",
                justifyContent: "flex-end",
                width: "93%",
              }}
            >
              <OpenInNewIcon
                sx={{
                  mr: 1,
                  fontSize: 12,
                }}
                color="disabled"
              />
            </div>
          )}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
}
