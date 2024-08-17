import { useAddType } from "@components/addNewEntry/useAddType";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Input,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { t } from "@src/chrome/i18n";
import CustomItemIcon from "@src/components/Options/CustomItemIcon";
import { DEFAULT_POPUP_URL } from "@src/config";
import { useScreenSize } from "@src/hooks/useScreenSize";
import { useBackupStore } from "@src/stores/useBackup";
import { useEntries } from "@src/stores/useEntries";
import { useModalStore } from "@src/stores/useModal";
import { decryptBackup } from "@src/utils/backup";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ImportBackup(props: { returnRaw?: boolean }) {
  const { returnRaw = false } = props;
  const [, setLocation] = useLocation();
  const { showMessage } = useBackupStore();
  const { isOpenModal, toggleModal } = useModalStore();
  const { setAddType, setSuccessMessage } = useAddType();

  const { setEntries } = useEntries();

  const { isOpen, setOpen, infoText, setInfoText, isCloseAccion, setCloseAction, jsonData, setJsonData } =
    useBackupStore();

  const { isUpSm } = useScreenSize();

  const handleCloseModal = () => {
    setOpen(false);
    setJsonData(null);
    setTimeout(() => {
      setInfoText(t("importBackupInfo"));
      setCloseAction(false);
    }, 200);
  };

  const handleCloseBackgroupModal = () => {
    const addEntryModalKey = "add-entry-modal-legacy";
    if (isOpenModal[addEntryModalKey]) {
      toggleModal(addEntryModalKey);
    }
  };

  const importBackup = (data: { data: string }) => {
    const entries = decryptBackup(data);
    if (entries.size === 0) throw new Error("No data found", { cause: "notEntriesFound" });
    setEntries(entries);
  };

  const hendleImportData = async () => {
    if (!jsonData) return;
    try {
      const data = JSON.parse(jsonData);
      importBackup(data);
      handleCloseModal();
      if (isOpenModal["add-entry-modal"]) {
        setAddType("success");
        setSuccessMessage(t("importSuccess"));
      } else {
        handleCloseBackgroupModal();
        setLocation(DEFAULT_POPUP_URL);
      }
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
              <CustomItemIcon>
                <UploadFileIcon />
              </CustomItemIcon>
              <ListItemText primary={t("importBackup")} />
            </ListItemButton>
            <FileInput />
          </ListItem>
        </label>
      )}

      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={() => setOpen(false)}
          sx={{ m: 0.5, p: 0, "& .MuiDialog-paper": { m: 1, p: 1 } }}
        >
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
      )}
    </>
  );
}
