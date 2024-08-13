import Tooltip from "@components/CustomTooltip";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Button, DialogActions, Divider, List, ListItem, ListItemText } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import type { OTPEntry } from "@src/entry/type";
import { useScreenSize } from "@src/hooks/useScreenSize";
import { useEntries } from "@src/stores/useEntries";
import { useState } from "react";
import { useLocation } from "wouter";

interface BackupDetailProps {
  entries: Map<string, OTPEntry>;
  handleClose: () => void;
}

export default function BackupDetail({ entries, handleClose }: BackupDetailProps) {
  const [importedList, setImportedList] = useState<string[]>([]);

  const entriesArray = Array.from(entries.values());
  const entriesNotFound = !entriesArray || entriesArray.length === 0;
  const entriesLength = entriesArray.length;

  const { upsertEntry } = useEntries();
  const [, setLocation] = useLocation();
  const { isXs } = useScreenSize();

  const handleImportAll = () => {
    entriesArray.forEach((entry) => upsertEntry(entry));
    // handleClose();
    setLocation("/");
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      //  maxWidth={"xs"}
      fullWidth={true}
    >
      <DialogTitle sx={{ py: 1 }}>Entries</DialogTitle>
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
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 50 }}>
              <p>No entries found.</p>
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
                <Tooltip title={entry.account}>
                  <ListItemText
                    primary={entry.account}
                    secondary={entry.issuer}
                    sx={{
                      mr: 2.5,
                      "& .MuiTypography-root": isXs && {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      },
                    }}
                  />
                </Tooltip>
              </ListItem>
            ))
          )}
        </List>
      </DialogContent>
      <DialogActions sx={{ py: 2, justifyContent: "space-evenly" }}>
        {entriesNotFound ? (
          <Button onClick={handleClose} size="small" autoFocus variant="contained" sx={{ px: 4 }}>
            Back
          </Button>
        ) : (
          <>
            <Button onClick={handleClose} size="small">
              back
            </Button>
            <Tooltip title="Import all entries">
              <Button
                onClick={handleImportAll}
                variant="contained"
                size="small"
                disabled={importedList.length === entriesLength}
              >
                Import all
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
    <Tooltip title={added ? "Added" : "Add"}>
      <IconButton edge="end" aria-label="add" onClick={() => handleImport(entry)}>
        {added ? <CheckCircleIcon sx={{ fontSize: 22 }} /> : <AddCircleOutlineIcon sx={{ fontSize: 22 }} />}
      </IconButton>
    </Tooltip>
  );
};
