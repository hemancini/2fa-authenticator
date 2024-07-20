import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Button, Dialog, DialogActions, DialogContent, Divider, Input } from "@mui/material";
import { List, ListItem, ListItemButton, ListItemText, Paper, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { t } from "@src/chrome/i18n";
import { ListItemIcon } from "@src/components/Options";
import EntriesContext from "@src/contexts/legacy/Entries";
import BackupData from "@src/models/legacy/backup";
import { useBackupStore } from "@src/stores/useBackupStore";
import { useActionStore, useModalStore } from "@src/stores/useDynamicStore";
import { useEntries } from "@src/stores/useEntries";
import { useOptionsStore } from "@src/stores/useOptions";
import { decryptBackup, exportBackup } from "@src/utils/backup";
import { useContext, useEffect } from "react";
import { useLocation } from "wouter";

export default function Backup() {
  const { showMessage } = useBackupStore();
  const { isNewVersion } = useOptionsStore();

  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDownloadJson = async () => {
    /**
     * @deprecated since version 1.3.0
     */
    const exportBackupLegacy = async () => {
      const dataLegacy = await BackupData.get();
      const jsonData = JSON.stringify(dataLegacy, null, 2);
      if (!jsonData) return;
      return new Blob([jsonData], { type: "application/json" });
    };

    try {
      const dataBlob = isNewVersion ? await exportBackup() : await exportBackupLegacy();
      const fileName = `${new Date().toISOString().split(".")[0]}.json`;
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showMessage(error.cause ? t(error.cause) : error.message);
    }
  };

  return (
    <Paper variant="outlined" sx={{ my: 1 }}>
      <List sx={{ p: 0 }}>
        <ListItem disablePadding>
          <ListItemButton dense={!isUpSm} onClick={handleDownloadJson}>
            <ListItemIcon>
              <FileDownloadIcon />
            </ListItemIcon>
            <ListItemText primary={t("exportBackup")} />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItemImportBackup />
      </List>
    </Paper>
  );
}

export const ListItemImportBackup = (props: { returnRaw?: boolean }) => {
  const { returnRaw = false } = props;
  const [, setLocation] = useLocation();
  const { handleEntriesUpdate } = useContext(EntriesContext);
  const { showMessage } = useBackupStore();
  const { modal, toggleModal } = useModalStore();
  const { actionState, toggleAction } = useActionStore();
  const { isNewVersion } = useOptionsStore();

  const { setEntries } = useEntries();

  const { isOpen, setOpen, infoText, setInfoText, isCloseAccion, setCloseAction, jsonData, setJsonData } =
    useBackupStore();

  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));

  const handleCloseModal = () => {
    setOpen(false);
    setJsonData(null);
    setTimeout(() => {
      setInfoText(t("importBackupInfo"));
      setCloseAction(false);
    }, 200);
  };

  const handleCloseBackgroupModal = () => {
    const addEntryModalKey = "add-entry-modal";
    const entriesEditActionKey = "entries-edit-state";

    if (modal[addEntryModalKey]) {
      toggleModal(addEntryModalKey);
    }
    if (actionState[entriesEditActionKey]) {
      toggleAction(entriesEditActionKey);
    }
  };

  const importBackup = async (data: { data: string }) => {
    const entries = await decryptBackup(data);
    if (entries.size === 0) throw new Error("No data found", { cause: "notEntriesFound" });
    setEntries(entries);
  };

  const hendleImportData = async () => {
    if (!jsonData) return;
    try {
      const data = JSON.parse(jsonData);
      isNewVersion ? await importBackup(data) : await BackupData.set(data);
      handleEntriesUpdate();
      handleCloseBackgroupModal();
      handleCloseModal();
      setLocation(DEFAULT_POPUP_URL);
    } catch (error) {
      showMessage(error.message);
    }
  };

  const handleUploadJson = (event) => {
    const file = event.target.files[0];

    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result as string;
        setJsonData(content);
      };
      reader.readAsText(file);
    } else {
      showMessage("Solo se permiten archivos JSON.");
    }
    event.target.value = null;
  };

  useEffect(() => {
    if (jsonData) setOpen(true);
  }, [jsonData]);

  const FileInput = () => (
    <Input
      type="file"
      id="update-file-button"
      style={{ display: "none" }}
      onChange={handleUploadJson}
      inputProps={{ accept: "application/JSON" }}
    />
  );

  return (
    <>
      {returnRaw ? (
        <>
          {t("importBackup")}
          <FileInput />
        </>
      ) : (
        <label htmlFor="update-file-button">
          <ListItem disablePadding dense={!isUpSm}>
            <ListItemButton>
              <ListItemIcon>
                <UploadFileIcon />
              </ListItemIcon>
              <ListItemText primary={t("importBackup")} />
            </ListItemButton>
            <FileInput />
          </ListItem>
        </label>
      )}

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
              <Button onClick={handleCloseModal} size="small" fullWidth>
                {t("cancel")}
              </Button>
              <Button onClick={hendleImportData} size="small" fullWidth variant="contained">
                {t("import")}
              </Button>
            </>
          ) : (
            <Button onClick={handleCloseModal} size="small" fullWidth variant="contained">
              Cerrar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
