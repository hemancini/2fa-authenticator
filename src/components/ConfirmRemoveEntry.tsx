import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { OTPEntry } from "@src/models/otp";
import * as React from "react";

export default function ConfirmRemoveEntry({
  entry,
  isConfirmOpen,
  setIsConfirmOpen,
  handleRemoveEntry,
}: {
  entry: OTPEntry;
  isConfirmOpen: boolean;
  setIsConfirmOpen: (isConfirmOpen: boolean) => void;
  handleRemoveEntry: (hash: string) => void;
}) {
  return (
    <Dialog
      open={isConfirmOpen}
      onClose={() => setIsConfirmOpen(false)}
      sx={{ m: 0.5, p: 0, "& .MuiDialog-paper": { m: 1, p: 1 } }}
    >
      <DialogContent sx={{ "&&": { p: 0, m: 0 } }}>
        <DialogContentText sx={{ p: 0, m: 1 }}>
          Are you sure you want to delete <span style={{ fontStyle: "italic" }}>{entry.account}</span> account?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-around", mx: 0, gap: 2 }}>
        <Button size="small" variant="outlined" fullWidth onClick={() => setIsConfirmOpen(false)}>
          Cancel
        </Button>
        <Button size="small" variant="contained" autoFocus fullWidth onClick={() => handleRemoveEntry(entry.hash)}>
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
}
