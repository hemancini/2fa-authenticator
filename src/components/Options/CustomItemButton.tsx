import Tooltip from "@components/CustomTooltip";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { CircularProgress } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import type { SxProps } from "@mui/material/styles";
import { useScreenSize } from "@src/hooks/useScreenSize";

import CustomItemIcon from "./CustomItemIcon";

interface CustomItemButtonProps {
  primary: string;
  toolltip?: string;
  handleButton: () => void;
  icon?: JSX.Element;
  isNewTab?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  sx?: SxProps;
  disableLeftPadding?: boolean;
}

export default function CustomItemButton({
  primary,
  toolltip,
  handleButton,
  icon,
  isNewTab = false,
  disabled = false,
  isLoading = false,
  sx = {},
  disableLeftPadding = false,
}: CustomItemButtonProps) {
  const { isUpSm } = useScreenSize();
  const disablePading = disableLeftPadding ? { "& .MuiButtonBase-root": { pl: 0.5, py: 1 } } : {};

  return (
    <ListItem disablePadding sx={{ ...sx, ...disablePading }}>
      <Tooltip title={toolltip ?? ""} disableInteractive>
        <ListItemButton dense={!isUpSm} onClick={handleButton} disabled={isLoading || disabled}>
          <CustomItemIcon>{icon ? icon : <Avatar sx={{ width: 24, height: 24 }} />}</CustomItemIcon>
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
          {isLoading && <CircularProgress size={22} />}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
}
