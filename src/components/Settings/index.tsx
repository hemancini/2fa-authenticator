import Tooltip from "@components/Tooltip";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CodeIcon from "@mui/icons-material/Code";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import GoogleIcon from "@mui/icons-material/Google";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import Input from "@mui/material/Input";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIconMui, { ListItemIconProps } from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import SwitchMui, { SwitchProps } from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { t } from "@src/chrome/i18n";
import EntriesContext from "@src/contexts/Entries";
import Backup from "@src/models/backup";
import { syncTimeWithGoogle } from "@src/models/options";
import { useOptionsStore } from '@src/stores/useOptionsStore';
import { useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";

import packageJson from "../../../package.json";

const initialInfoText = "Esta acción agregará y actualizará los datos importados a los existentes.";

const Switch = (props: SwitchProps) => {
  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));

  const stylesDownSm = {
    "& .MuiSwitch-track": { width: 25, height: "75%" },
    "& .MuiSwitch-thumb": { width: 16, height: 16 },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(15px)",
    },
  };

  return <SwitchMui sx={!isUpSm ? stylesDownSm : {}} {...props} />;
};

const ListItemIcon = (props: ListItemIconProps) => {
  return <ListItemIconMui sx={{ minWidth: "auto", ml: 0.2, mr: 2 }} {...props} />;
};

export default function Settings() {
  const [isOpen, setOpen] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [infoText, setInfoText] = useState(initialInfoText);
  const [isCloseAccion, setCloseAction] = useState(false);
  const { handleEntriesUpdate } = useContext(EntriesContext);
  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));
  const [, setLocation] = useLocation();
  const {
    tooltipEnabled,
    toggleTooltipEnabled,
    toggleBypassEnabled,
    toggleAutofillEnabled,
    bypassEnabled,
    autofillEnabled,
  } = useOptionsStore();

  const handleDownloadJson = async () => {
    try {
      const data = await Backup.get();
      const jsonData = JSON.stringify(data, null, 2);
      if (!jsonData) return;

      const fileName = `${new Date().toISOString().split(".")[0]}.json`;
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showMessage(error.cause ? t(error.cause) : error.message);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setJsonData(content);
      };
      reader.readAsText(file);
    } else {
      showMessage("Solo se permiten archivos JSON.");
    }
    event.target.value = null;
  };

  const hendleImportData = async () => {
    if (!jsonData) return;
    try {
      const data = JSON.parse(jsonData);
      await Backup.set(data);
      handleEntriesUpdate();
      handleClose();
      setLocation(DEFAULT_POPUP_URL);
    } catch (error) {
      showMessage(error.message);
    }
  };

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

  const handleClose = () => {
    setOpen(false);
    setJsonData(null);
    setTimeout(() => {
      setInfoText(initialInfoText);
      setCloseAction(false);
    }, 200);
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

  const showMessage = (message: string, isInfo?: boolean) => {
    setCloseAction(!isInfo);
    setInfoText(message);
    setOpen(true);
  };

  useEffect(() => {
    if (jsonData) setOpen(true);
  }, [jsonData]);

  return (
    <main style={{ marginTop: 12, display: "grid", gap: 4 }}>
      <Dialog open={isOpen} onClose={() => setOpen(false)} sx={{ m: 0.5, p: 0, "& .MuiDialog-paper": { m: 1, p: 1 } }}>
        <DialogContent sx={{ p: 1 }}>
          <Typography variant="body2" gutterBottom>
            {infoText}
          </Typography>
        </DialogContent>
        <Divider />
        <DialogActions>
          {!isCloseAccion ? (
            <>
              <Button onClick={handleClose} size="small" fullWidth>
                {t("cancel")}
              </Button>
              <Button onClick={hendleImportData} size="small" fullWidth variant="contained">
                Importar
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} size="small" fullWidth variant="contained">
              Cerrar
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Paper variant="outlined" sx={{ my: 1 }}>
        <List sx={{ p: 0 }}>
          <ListItem disablePadding dense={!isUpSm}>
            <Tooltip title={t("showTooltip")} disableInteractive>
              <ListItemButton onClick={toggleTooltipEnabled}>
                <ListItemIcon>
                  <InfoOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={"Tooltip"} />
                <div style={{ position: "absolute", display: "flex", justifyContent: "flex-end", width: "93%" }}>
                  <Switch checked={tooltipEnabled} />
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
                <div style={{ position: "absolute", display: "flex", justifyContent: "flex-end", width: "93%" }}>
                  <Switch checked={bypassEnabled} />
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
                <div style={{ position: "absolute", display: "flex", justifyContent: "flex-end", width: "93%" }}>
                  <Switch checked={autofillEnabled} />
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

      <Paper variant="outlined" sx={{ my: 1 }}>
        <List sx={{ p: 0 }}>
          <label htmlFor="update-file-button">
            <ListItem disablePadding dense={!isUpSm}>
              <ListItemButton>
                <ListItemIcon>
                  <UploadFileIcon />
                </ListItemIcon>
                <ListItemText primary={t("importBackup")} />
              </ListItemButton>
              <Input
                type="file"
                id="update-file-button"
                style={{ display: "none" }}
                onChange={handleFileUpload}
                inputProps={{ accept: "application/JSON" }}
              />
            </ListItem>
          </label>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton dense={!isUpSm} onClick={handleDownloadJson}>
              <ListItemIcon>
                <FileDownloadIcon />
              </ListItemIcon>
              <ListItemText primary={t("exportBackup")} />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ my: 1 }}>
        <List sx={{ p: 0 }}>
          <ListItem disablePadding>
            <Tooltip title={t("popupMode")} disableInteractive>
              <ListItemButton dense={!isUpSm} onClick={handleOpenPopup}>
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
