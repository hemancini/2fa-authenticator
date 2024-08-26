import { useAddType } from "@components/addNewEntry/useAddType";
import Tooltip from "@components/CustomTooltip";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Button, DialogActions, Divider, List, ListItem, ListItemText } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { t } from "@src/chrome/i18n";
import { useScreenSize } from "@src/hooks/useScreenSize";
import { useEntries } from "@src/stores/useEntries";
import { useModalStore } from "@src/stores/useModal";
import { useState } from "react";
import { useLocation } from "wouter";

interface BackupDetailProps {
  title: string;
  entries: Map<string, OTPEntry>;
  handleClose: () => void;
}

export default function BackupDetail({ title, entries, handleClose }: BackupDetailProps) {
  const [importedList, setImportedList] = useState<string[]>([]);
  const { setAddType, setSuccessMessage } = useAddType();
  const { isOpenModal } = useModalStore();

  const entriesArray = Array.from(entries.values());
  const entriesNotFound = !entriesArray || entriesArray.length === 0;
  const entriesLength = entriesArray.length;

  const { upsertEntry } = useEntries();
  const [, setLocation] = useLocation();
  const { isXs } = useScreenSize();

  const handleImportAll = () => {
    entriesArray.forEach((entry) => upsertEntry(entry));

    if (isOpenModal["add-entry-modal"]) {
      setAddType("success");
      setSuccessMessage(t("importSuccess"));
    } else {
      setLocation("/");
    }

    handleClose();
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": { m: 1 },
        "& .MuiDialogTitle-root": {
          p: 1,
          pl: 2,
          pb: 0,
          width: { sm: 300 },
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        "& .MuiDialogActions-root": { p: 1, pb: { md: 2 }, justifyContent: "space-evenly" },
      }}
    >
      <DialogTitle title={title}>{title}</DialogTitle>
      <Divider />
      <DialogContent
        sx={{
          py: 2,
          px: 1.5,
          minWidth: !isXs ? 285 : "auto",
        }}
      >
        <List dense disablePadding>
          {entriesNotFound ? (
            <Box sx={{ textAlign: "center", minHeight: 50 }}>
              <p>{t("noEntriesFound")}</p>
            </Box>
          ) : (
            entriesArray.map((entry) => (
              <ListItem
                key={entry.hash}
                dense
                disableGutters
                disablePadding
                divider
                secondaryAction={<ImportEntryButton {...{ entry, setImportedList }} />}
              >
                <ListItemText
                  title={entry.account}
                  primary={entry.issuer}
                  secondary={entry.account}
                  sx={{
                    mr: 2.5,
                    "& .MuiTypography-root": isXs && {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                />
              </ListItem>
            ))
          )}
        </List>
      </DialogContent>
      <DialogActions>
        {entriesNotFound ? (
          <Button onClick={handleClose} size="small" autoFocus variant="contained" sx={{ px: 4 }}>
            {t("close")}
          </Button>
        ) : (
          <>
            <Button onClick={handleClose} size="small">
              {t("close")}
            </Button>
            <Tooltip title={t("importAllEntries")}>
              <Button
                onClick={handleImportAll}
                variant="contained"
                size="small"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                disabled={importedList.length === entriesLength}
              >
                {t("importAll")}
              </Button>
            </Tooltip>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

interface ImportEntryButtonProps {
  entry: OTPEntry;
  setImportedList: React.Dispatch<React.SetStateAction<string[]>>;
}

const ImportEntryButton = ({ entry, setImportedList }: ImportEntryButtonProps) => {
  const [added, setAdded] = useState(false);
  const { upsertEntry } = useEntries();

  const handleImport = async (entry: OTPEntry) => {
    upsertEntry(entry);
    setAdded(true);
    setImportedList((prev) => [...prev, entry.hash]);
  };

  return (
    <Tooltip title={added ? t("added") : t("add")}>
      <IconButton edge="end" aria-label={t("add")} onClick={() => handleImport(entry)}>
        {added ? <CheckCircleIcon sx={{ fontSize: 22 }} /> : <AddCircleOutlineIcon sx={{ fontSize: 22 }} />}
      </IconButton>
    </Tooltip>
  );
};
