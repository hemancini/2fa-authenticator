import ChromeStoreIcon from "@assets/img/chrome-store-192px.svg";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CodeIcon from "@mui/icons-material/Code";
import DataArrayIcon from "@mui/icons-material/DataArray";
import GoogleIcon from "@mui/icons-material/Google";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TabIcon from "@mui/icons-material/Tab";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import { t } from "@src/chrome/i18n";
import Backup from "@src/components/Options/Backup";
import { DEFAULT_POPUP_URL } from "@src/config";
import GoogleBackups from "@src/develop/components/GoogleBackups";
import { useScreenSize } from "@src/hooks/useScreenSize";
import { useBackupStore } from "@src/stores/useBackup";
import { useFeatureFlags } from "@src/stores/useFeatureFlags";
import { useOptionsStore } from "@src/stores/useOptions";
import { syncTimeWithGoogle } from "@src/utils/options";

import packageJson from "../../../package.json";
import CustomListButton from "./CustomItemButton";
import CustomItemIcon from "./CustomItemIcon";
import CustomItemSwitch from "./CustomItemSwitch";

const useCloudBackup = false;

const isDev = import.meta.env.VITE_IS_DEV === "true";
const chromeWebStoreUrl = "https://chromewebstore.google.com/detail/2fa-authenticator/pnnmjhghimefjdmdilmlhnojccjgpgeh";

export default function Options() {
  const { showMessage } = useBackupStore();
  const { entrustBypass, visibleTokens } = useFeatureFlags();

  const {
    tooltipEnabled,
    toggleTooltipEnabled,
    toggleBypassEnabled,
    toggleAutofillEnabled,
    toggleVisibleTokens,
    bypassEnabled,
    autofillEnabled,
    isVisibleTokens,
    xraysEnabled,
    toggleXraysEnabled,
  } = useOptionsStore();

  const { isUpSm } = useScreenSize();

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
          <CustomItemSwitch
            primary={"Tooltip"}
            tooltip={t("showTooltip")}
            switchEnabled={tooltipEnabled}
            toggleSwitch={toggleTooltipEnabled}
            icon={<InfoOutlinedIcon />}
          />
          {entrustBypass && (
            <>
              <Divider />
              <CustomItemSwitch
                primary={"Entrust bypass"}
                tooltip={t("bypass")}
                switchEnabled={bypassEnabled}
                toggleSwitch={toggleBypassEnabled}
                icon={
                  <svg viewBox="0 0 70 70" width="22" height="22">
                    <g>
                      <path fillRule="evenodd" fill="none" d="m-79-6h256v120h-256z" />
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="m60.3 73.9v12.7c0.1 1.8 0.8 3.9 7 3.9 6.4 0 7-2.1 7-4v-12.6h4.9v13.6c0 4.9-5.2 7.5-11.9 7.5-6.6 0-11.8-2.6-11.8-7.5v-13.6zm25.8 5.8c0.4-6.6 10.1-6.4 11.6-6.3 1.4 0.1 6.6 0 10.8 3.3l-3.1 3.2c-1.8-1.1-4.2-1.9-7.4-2-2.8-0.2-6.8 0-6.8 1.4 0 1.3 1.6 1.5 6.9 1.9h0.3l0.5 0.1h0.5l0.5 0.1c4.9 0.5 9.6 1.6 9.3 6.8-0.2 5-5.5 6.6-11.7 6.6-5.1 0-9.2-1.2-12.5-3.8l2.8-3.6c1.8 1.6 5.2 3 9.2 3 6.2 0.1 7.1-1.7 7.1-2.5v-0.1c-0.1-0.8-0.7-1.8-7.2-2-6.9-0.2-11.1-1.6-10.8-6.1zm-127.9-5.8v4.5h-16.4v3.1h11.4v4.6h-11.4v3.9h17.2v4.5h-22.1v-20.6c0 0 21.3 0 21.3 0zm13.8 0l12.4 15.3v-15.3h4.9v20.6h-6.4l-12.5-15.3v15.3h-4.9v-20.6c0 0 6.5 0 6.5 0zm46.6 0v4.5h-9.3v16.1h-4.9v-16.1h-9.3v-4.5c0 0 23.5 0 23.5 0zm118.3 0v4.5h-9.3v16.1h-4.9v-16.1h-9.3v-4.5c0 0 23.5 0 23.5 0zm-96.1 0q3.3 0 5.3 1.8 2 1.9 2 4.9 0 4.9-4.5 6.3l5.4 7.6h-5.7l-5.1-7.2h-8.8v7.2h-4.9v-20.6c0 0 16.3 0 16.3 0zm-0.7 4.5h-10.7v4.4h10.5c2.9 0 3.2-1 3.2-2.2 0-1.3-0.9-2.2-3-2.2zm-5.1-76.4l28.2 16.3v32.5l-28.2 16.2-28.2-16.2v-32.5zm0 5.2l-23.6 13.6v27.3l23.6 13.7 23.7-13.7v-27.3zm0 5.3l19.1 11v3.9l-14.7 8.5v4.5l14.7-8.4v4.5l-14.7 8.5v4.6l14.7-8.6v4.6l-19.1 11-19.1-11v-22.1c0 0 19.1-11 19.1-11z"
                      />
                    </g>
                  </svg>
                }
              />
            </>
          )}
          <Divider />
          <CustomItemSwitch
            primary={t("autofill")}
            tooltip={t("autofillDesc")}
            switchEnabled={autofillEnabled}
            toggleSwitch={toggleAutofillEnabled}
            icon={<AutoFixHighIcon sx={{ fontSize: 20 }} />}
          />
          {visibleTokens && (
            <>
              <Divider />
              <CustomItemSwitch
                primary={t("visibleTokens")}
                tooltip={t("visibleTokensDesc")}
                switchEnabled={isVisibleTokens}
                toggleSwitch={toggleVisibleTokens}
                icon={
                  isVisibleTokens ? (
                    <VisibilityIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <VisibilityOffIcon sx={{ fontSize: 20 }} />
                  )
                }
              />
            </>
          )}
          {isDev && (
            <>
              <Divider />
              <CustomItemSwitch
                primary={"X-Rays"}
                tooltip={"X-Rays enabled"}
                switchEnabled={xraysEnabled}
                toggleSwitch={toggleXraysEnabled}
                icon={<DataArrayIcon sx={{ fontSize: 20 }} />}
              />
            </>
          )}
        </List>
      </Paper>
      {useCloudBackup ? <GoogleBackups /> : <Backup />}
      <Paper variant="outlined" sx={{ my: 1 }}>
        <List sx={{ p: 0 }}>
          <ListItem disablePadding>
            <ListItemButton dense={!isUpSm} onClick={handleSyncClock} sx={{ pr: 0 }}>
              <CustomItemIcon>
                <GoogleIcon />
              </CustomItemIcon>
              <ListItemText primary={t("syncTimeWithGoogle")} />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>

      <Paper variant="outlined" sx={{ my: 1 }}>
        <List sx={{ p: 0 }}>
          <CustomListButton
            primary={"Popup"}
            toolltip={t("popupMode")}
            handleButton={handlePopupMode}
            icon={<OpenInNewIcon />}
            isNewTab={true}
          />
          <Divider />
          <CustomListButton
            primary={t("sourceCode")}
            toolltip={t("sourceCode")}
            handleButton={() => window.open(packageJson.repository.url, "_blank")}
            icon={<CodeIcon />}
            isNewTab={true}
          />
          {isDev && (
            <>
              <Divider />
              <CustomListButton
                isNewTab
                primary="Open in browser"
                toolltip="Open in browser"
                icon={<TabIcon />}
                handleButton={() =>
                  chrome.tabs.create({
                    url: chrome.runtime.getURL(DEFAULT_POPUP_URL),
                  })
                }
              />
              <Divider />
              <CustomListButton
                primary={"Chrome Web Store"}
                toolltip={"Chrome Web Store"}
                handleButton={() => window.open(chromeWebStoreUrl, "_blank")}
                icon={<img src={ChromeStoreIcon} alt="icon" width={22} height={22} />}
                isNewTab={true}
              />
            </>
          )}
        </List>
      </Paper>
    </main>
  );
}
