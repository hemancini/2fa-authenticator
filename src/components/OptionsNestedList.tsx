import Tooltip from "@components/Tooltip";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import useMediaQuery from "@mui/material/useMediaQuery";
import { t } from "@src/chrome/i18n";
import OptionsContext from "@src/contexts/Options";
import { useContext, useState } from "react";

export default function OptionsNestedList() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));
  const { tooltipEnabled, toggleTooltipEnabled, bypassEnabled, toggleBypassEnabled } = useContext(OptionsContext);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleOpenPopup = () => {
    const windowType = "panel";
    chrome.windows
      .create({
        url: chrome.runtime.getURL(`${DEFAULT_POPUP_URL}?popup=true`),
        type: windowType,
        height: isUpSm ? 365 : window.innerHeight + 40,
        width: isUpSm ? 290 : window.innerWidth,
      })
      .then(() => {
        if (!isUpSm) {
          window.close();
        }
      });
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton dense={true} disableGutters selected={open} onClick={handleClick} sx={{ px: 1 }}>
          <ListItemIcon sx={{ minWidth: "auto", ml: 0.2, mr: 2, "& .MuiSvgIcon-root": { fontSize: 20 } }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={t("options")} />
          <Box sx={{ pl: 2, display: "flex", justifyContent: "center" }}>{open ? <ExpandLess /> : <ExpandMore />}</Box>
        </ListItemButton>
      </ListItem>
      <Divider />
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding sx={{ "& .MuiTypography-root": { fontSize: 14 } }}>
            <Tooltip title={t("bypass")} disableInteractive>
              <ListItemButton dense={true} onClick={toggleBypassEnabled} sx={{ pr: 1 }}>
                <ListItemText primary="Bypass" sx={{ ml: 3 }} />
                <Switch
                  size="small"
                  checked={bypassEnabled}
                  sx={{
                    width: 30,
                    height: 22,
                    "& .MuiSwitch-thumb": { width: 14, height: 14 },
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      transform: "translateX(10px)",
                      color: "primary.main",
                      "& + .MuiSwitch-track": {
                        opacity: 1,
                        backgroundColor: "primary.dark",
                      },
                    },
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <Divider sx={{ ml: 2.8 }} />
          <ListItem disablePadding sx={{ "& .MuiTypography-root": { fontSize: 14 } }}>
            <Tooltip title={t("showTooltip")} disableInteractive>
              <ListItemButton dense={true} onClick={toggleTooltipEnabled} sx={{ pr: 1 }}>
                <ListItemText primary={"Tooltip"} sx={{ ml: 3 }} />
                <Switch
                  size="small"
                  checked={tooltipEnabled}
                  sx={{
                    width: 30,
                    height: 22,
                    "& .MuiSwitch-thumb": { width: 14, height: 14 },
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      transform: "translateX(10px)",
                      color: "primary.main",
                      "& + .MuiSwitch-track": {
                        opacity: 1,
                        backgroundColor: "primary.dark",
                      },
                    },
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <Divider sx={{ ml: 2.8 }} />
          <ListItem disablePadding sx={{ "& .MuiSvgIcon-root": { fontSize: 18 } }}>
            <Tooltip title={t("popupMode")} disableInteractive>
              <ListItemButton dense={true} onClick={handleOpenPopup} sx={{ pr: 1 }}>
                <ListItemText primary={"Popup"} sx={{ ml: 3 }} />
                <ListItemIcon sx={{ minWidth: "auto", ml: 0.2, mr: 0.8 }}>
                  <OpenInNewIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
        <Divider />
      </Collapse>
    </>
  );
}
