import CustomSwitch from "@components/CustomSwitch";
import Tooltip from "@components/CustomTooltip";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CodeIcon from "@mui/icons-material/Code";
import GoogleIcon from "@mui/icons-material/Google";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIconMui, { ListItemIconProps } from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { t } from "@src/chrome/i18n";
import Backup from "@src/components/Options/Backup";
import { syncTimeWithGoogle } from "@src/models/options";
import { useBackupStore } from "@src/stores/useBackupStore";
import { useOptionsStore } from "@src/stores/useOptions";

import packageJson from "../../../package.json";

export const ListItemIcon = (props: ListItemIconProps) => (
  <ListItemIconMui sx={{ minWidth: "auto", ml: 0.2, mr: 2 }} {...props} />
);

export default function Options() {
  const { showMessage } = useBackupStore();

  const {
    tooltipEnabled,
    toggleTooltipEnabled,
    toggleBypassEnabled,
    toggleAutofillEnabled,
    bypassEnabled,
    autofillEnabled,
  } = useOptionsStore();

  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));

  const handleSyncClock = () => {
    chrome.permissions.request({ origins: ["https://www.google.com/"] }, async (granted) => {
      try {
        if (!granted) throw new Error("No se otorgaron los permisos necesarios.");
        const message = await syncTimeWithGoogle();
        showMessage(message, true);
      } catch (error) {
        showMessage(error.message);
      }
    });
  };

  const handlePopupMode = () => {
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
    <main style={{ marginTop: 12, display: "grid", gap: 4 }}>
      <Paper variant="outlined" sx={{ my: 1 }}>
        <List sx={{ p: 0 }}>
          <ListItem disablePadding dense={!isUpSm}>
            <Tooltip title={t("showTooltip")} disableInteractive>
              <ListItemButton onClick={toggleTooltipEnabled}>
                <ListItemIcon>
                  <InfoOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={"Tooltip"} />
                <div
                  style={{
                    position: "absolute",
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "93%",
                  }}
                >
                  <CustomSwitch checked={tooltipEnabled} />
                </div>
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <Tooltip title={t("bypass")} disableInteractive>
              <ListItemButton dense={!isUpSm} onClick={toggleBypassEnabled}>
                <ListItemIcon>
                  <img src="/providers/2yguh43k12y4g12u4.webp" alt="icon" width={24} height={24} />
                </ListItemIcon>
                <ListItemText primary="Entrust bypass" />
                <div
                  style={{
                    position: "absolute",
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "93%",
                  }}
                >
                  <CustomSwitch checked={bypassEnabled} />
                </div>
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <Tooltip title={t("autofillDesc")} disableInteractive>
              <ListItemButton dense={!isUpSm} onClick={toggleAutofillEnabled}>
                <ListItemIcon>
                  <AutoFixHighIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary={t("autofill")} />
                <div
                  style={{
                    position: "absolute",
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "93%",
                  }}
                >
                  <CustomSwitch checked={autofillEnabled} />
                </div>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Paper>

      <Paper variant="outlined" sx={{ my: 1 }}>
        <List sx={{ p: 0 }}>
          <ListItem disablePadding>
            <ListItemButton dense={!isUpSm} onClick={handleSyncClock} sx={{ pr: 0 }}>
              <ListItemIcon>
                <GoogleIcon />
              </ListItemIcon>
              <ListItemText primary={t("syncTimeWithGoogle")} />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>

      <Backup />

      <Paper variant="outlined" sx={{ my: 1 }}>
        <List sx={{ p: 0 }}>
          <ListItem disablePadding>
            <Tooltip title={t("popupMode")} disableInteractive>
              <ListItemButton dense={!isUpSm} onClick={handlePopupMode}>
                <ListItemIcon>
                  <OpenInNewIcon />
                </ListItemIcon>
                <ListItemText primary={"Popup"} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton dense={!isUpSm} href={packageJson.repository.url} target="_blank">
              <ListItemIcon>
                <CodeIcon />
              </ListItemIcon>
              <ListItemText primary={t("sourceCode")} />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>
    </main>
  );
}
