import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, DialogActions, Divider, List, ListItem, ListItemText } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import type { OTPEntry } from "@src/entry/type";
import { useScreenSize } from "@src/hooks/useScreenSize";
import { useEntries } from "@src/stores/useEntries";
import { useState } from "react";
import { useLocation } from "wouter";

const AddButton = ({ entry }: { entry: OTPEntry }) => {
  const [added, setAdded] = useState(false);
  const { upsertEntry } = useEntries();

  const handleImport = async (entry: OTPEntry) => {
    upsertEntry(entry);
    setAdded(true);
  };

  return (
    <IconButton edge="end" aria-label="add" onClick={() => handleImport(entry)}>
      {added ? <CheckCircleIcon sx={{ fontSize: 22 }} /> : <AddCircleOutlineIcon sx={{ fontSize: 22 }} />}
    </IconButton>
  );
};

interface BackupDetailProps {
  entries: Map<string, OTPEntry>;
  handleClose: () => void;
}

export default function BackupDetail({ entries, handleClose }: BackupDetailProps) {
  const { upsertEntry } = useEntries();
  const [, setLocation] = useLocation();
  const { isXs } = useScreenSize();

  const handleImportAll = () => {
    Array.from(entries.values()).forEach((entry) => upsertEntry(entry));
    // handleClose();
    setLocation("/");
  };

  return (
    <Dialog onClose={handleClose} open={true} maxWidth={"xs"} fullWidth={isXs}>
      <DialogTitle sx={{ py: 1 }}>Entries</DialogTitle>
      <Divider />
      <DialogContent
        sx={{
          p: 2,
          minWidth: !isXs ? 285 : "auto",
        }}
      >
        <List dense disablePadding>
          {Array.from(entries.values()).map((entry) => (
            <ListItem
              key={entry.hash}
              dense
              disableGutters
              disablePadding
              divider
              secondaryAction={<AddButton entry={entry} />}
            >
              <ListItemText
                title={entry.account}
                primary={entry.account}
                secondary={entry.issuer}
                sx={{
                  "& .MuiTypography-root": {
                    width: 165,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{ py: 2, justifyContent: "space-evenly" }}>
        <Button onClick={handleClose} size="small">
          Close
        </Button>
        <Button onClick={handleImportAll} variant="contained" size="small">
          Import all
        </Button>
      </DialogActions>
    </Dialog>
  );
}
