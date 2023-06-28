import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";

import ManualEntry from "./ManualEntry";
import ManualTotpEntry from "./ManualTotpEntry";
import Options from "./Options";

export interface AddEntryProps {
  handlerOnCandel: () => void;
  handleOnAddEntryClose?: () => void;
}

export interface AddEntryMenuProps {
  isAddEntryMenuOpen: boolean;
  setAddEntryMenuOpen: (isAddEntryMenuOpen: boolean) => void;
}

export default function AddEntryMenu({ isAddEntryMenuOpen, setAddEntryMenuOpen }: AddEntryMenuProps) {
  const [manualEntryOptions, setManualEntryOptions] = useState<"" | "TOTP" | "MANUAL">("");

  const handleOnAddEntryClose = () => {
    setAddEntryMenuOpen(false);
    setTimeout(() => {
      setManualEntryOptions("");
    }, 500);
  };

  const handleOnAddEntryCancel = () => {
    setManualEntryOptions("");
  };

  return (
    <Dialog
      open={isAddEntryMenuOpen}
      aria-labelledby="customized-dialog-title"
      onClose={handleOnAddEntryClose}
      sx={{ m: 0.5, p: 0, "& .MuiDialog-paper": { m: 1, p: 1, pb: 0, minWidth: 220 } }}
    >
      <DialogTitle fontSize={18} sx={{ m: 0, mb: 0.5, p: 0, px: 1.4 }}>
        Add new entry
        <IconButton
          aria-label="close"
          onClick={handleOnAddEntryClose}
          sx={{
            top: 1,
            right: 2,
            position: "absolute",
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ px: 1, display: "grid", direction: "column", gap: 2.5 }}>
        {manualEntryOptions === "TOTP" ? (
          <ManualTotpEntry handlerOnCandel={handleOnAddEntryCancel} handleOnAddEntryClose={handleOnAddEntryClose} />
        ) : manualEntryOptions === "MANUAL" ? (
          <ManualEntry handlerOnCandel={handleOnAddEntryCancel} />
        ) : (
          <Options setManualEntryOptions={setManualEntryOptions} />
        )}
      </DialogContent>
    </Dialog>
  );
}
