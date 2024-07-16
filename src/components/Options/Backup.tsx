import FileDownloadIcon from "@mui/icons-material/FileDownload";
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
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { t } from "@src/chrome/i18n";
import { ListItemIcon } from "@src/components/Options";
import EntriesContext from "@src/contexts/legacy/Entries";
import BackupData from "@src/models/backup";
import { useActionStore, useModalStore } from "@src/stores/useDynamicStore";
import { useContext, useEffect } from "react";
import { useLocation } from "wouter";
import { create } from "zustand";

type BackupStoreProps = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  jsonData: string | null;
  setJsonData: (value: string) => void;
  infoText: string;
  setInfoText: (value: string) => void;
  isCloseAccion: boolean;
  setCloseAction: (value: boolean) => void;
  showMessage: (message: string, isInfo?: boolean) => void;
};

export const useBackupStore = create<BackupStoreProps>((set) => ({
  isOpen: false,
  setOpen: (value) => set({ isOpen: value }),
  jsonData: null,
  setJsonData: (value) => set({ jsonData: value }),
  infoText: t("importBackupInfo"),
  setInfoText: (value) => set({ infoText: value }),
  isCloseAccion: false,
  setCloseAction: (value) => set({ isCloseAccion: value }),
  showMessage: (message, isInfo = false) => {
    set({ infoText: message, isCloseAccion: isInfo, isOpen: true });
  },
}));

export default function Backup() {
  const { showMessage } = useBackupStore();

  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDownloadJson = async () => {
    try {
      const data = await BackupData.get();
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

  return (
    <Paper variant="outlined" sx={{ my: 1 }}>
      <List sx={{ p: 0 }}>
        <ImportBackupListItem />
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
  );
}

export const ImportBackupListItem = (props: { returnRaw?: boolean }) => {
  const { returnRaw = false } = props;
  const [, setLocation] = useLocation();
  const { handleEntriesUpdate } = useContext(EntriesContext);
  const { showMessage } = useBackupStore();
  const { modal, toggleModal } = useModalStore();
  const { actionState, toggleAction } = useActionStore();

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

  const hendleImportData = async () => {
    if (!jsonData) return;
    try {
      const data = JSON.parse(jsonData);
      await BackupData.set(data);
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
