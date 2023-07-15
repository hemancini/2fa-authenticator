import Tooltip from "@components/Tooltip";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Button, Dialog, DialogActions, DialogContent, Input, Switch, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { t } from "@src/chrome/i18n";
import EntriesContext from "@src/contexts/Entries";
import OptionsContext from "@src/contexts/Options";
import Backup from "@src/models/backup";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";

const initialInfoText = "Esta acción agregará y actualizará los datos importados a los existentes.";

export default function BackupEntries() {
  const [isOpen, setOpen] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [infoText, setInfoText] = useState(initialInfoText);
  const [isAccionError, setAccionError] = useState(false);
  const { handleEntriesUpdate } = useContext(EntriesContext);
  const [, setLocation] = useLocation();
  const { tooltipEnabled, toggleTooltipEnabled, toogleBypassEnabled, bypassEnabled } = useContext(OptionsContext);

  const handleDownloadJson = async () => {
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
      setInfoText("Solo se permiten archivos JSON.");
      setAccionError(true);
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
      setInfoText(error.message);
      setAccionError(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setJsonData(null);
    setTimeout(() => {
      setInfoText(initialInfoText);
      setAccionError(false);
    }, 200);
  };

  useEffect(() => {
    if (jsonData) setOpen(true);
  }, [jsonData]);

  return (
    <main style={{ marginTop: 20 }}>
      <Dialog open={isOpen} onClose={() => setOpen(false)} sx={{ m: 0.5, p: 0, "& .MuiDialog-paper": { m: 1, p: 1 } }}>
        <DialogContent sx={{ p: 1 }}>
          <Typography variant="body2" gutterBottom>
            {infoText}
          </Typography>
        </DialogContent>
        <Divider />
        <DialogActions>
          {!isAccionError ? (
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
      {/* </Paper> */}
      <List sx={{ mt: 2 }}>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton onClick={handleDownloadJson}>
            <ListItemIcon>
              <FileDownloadIcon />
            </ListItemIcon>
            <ListItemText primary="Exportar data" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <label htmlFor="update-button-file">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <UploadFileIcon />
              </ListItemIcon>
              <ListItemText primary="Importar data" />
            </ListItemButton>
            <Input
              type="file"
              inputProps={{ accept: "application/JSON" }}
              id="update-button-file"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </ListItem>
        </label>
        <Divider />
        <ListItem disablePadding>
          <Tooltip title={t("showTooltip")} disableInteractive>
            <ListItemButton onClick={toggleTooltipEnabled}>
              <ListItemIcon>
                <InfoOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={"Tooltip"} />
              <Switch checked={tooltipEnabled} />
            </ListItemButton>
          </Tooltip>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <Tooltip title={t("bypass")} disableInteractive>
            <ListItemButton onClick={toogleBypassEnabled}>
              <ListItemIcon>
                {/* <img src="https://us.trustedauth.com/favicon.png" alt="icon" width={24} height={24} /> */}
                <img src="/2yguh43k12y4g12u4.webp" alt="icon" width={24} height={24} />
              </ListItemIcon>
              <ListItemText primary="Entrust bypass" />
              <Switch checked={bypassEnabled} />
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </main>
  );
}
