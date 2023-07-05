import Tooltip from "@components/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { t } from "@src/chrome/i18n";
import EntriesContext from "@src/contexts/Entries";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";

import Options from "./AddOptions";
import ManualEntry from "./ManualEntry";
import ManualTotpEntry from "./ManualTotpEntry";

export interface AddEntryProps {
  handlerOnCandel: () => void;
  handleOnAddEntryClose?: () => void;
}

export interface AddEntryMenuProps {
  isAddEntryMenuOpen: boolean;
  setAddEntryMenuOpen: (isAddEntryMenuOpen: boolean) => void;
  setEntriesEdited: (isEntriesEdited: boolean) => void;
}

export default function AddEntryMenu({ isAddEntryMenuOpen, setAddEntryMenuOpen, setEntriesEdited }: AddEntryMenuProps) {
  const [manualEntryOptions, setManualEntryOptions] = useState<"" | "TOTP" | "MANUAL">("");
  const { handleEntriesEdited } = useContext(EntriesContext);
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (manualEntryOptions !== "") {
      handleEntriesEdited();
    }
  }, [manualEntryOptions]);

  const handleOnAddEntryClose = () => {
    setAddEntryMenuOpen(false);
    setTimeout(() => {
      setManualEntryOptions("");
    }, 500);
  };

  const handleOnAddEntryCancel = () => {
    setManualEntryOptions("");
  };

  const handlerGoToHome = () => {
    handleOnAddEntryClose();
    setEntriesEdited(false);
    navigate("/", { replace: true }); // `replaceState` is used
  };

  return (
    <Dialog
      open={isAddEntryMenuOpen}
      onClose={handleOnAddEntryClose}
      sx={{ mx: 3, "& .MuiDialog-paper": { minWidth: { xs: "100%", sm: "30%" }, pb: 0.5 } }}
    >
      <DialogTitle
        fontSize={18}
        sx={{
          m: 1,
          my: { xs: 1.2, sm: 1.5 },
          p: 0,
          pr: 2,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: { sm: 20 },
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        {t("addNewEntry")}
        <Tooltip title={t("cancel")} disableInteractive>
          <IconButton
            aria-label="close"
            onClick={handleOnAddEntryClose}
            sx={{
              top: 5,
              right: 1,
              position: "absolute",
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <Divider />
      <DialogContent
        sx={{
          py: 3,
          px: { xs: 1, sm: 3 },
          mx: { xs: 1, sm: 3 },
          display: "grid",
          direction: "column",
          gap: 3,
        }}
      >
        {manualEntryOptions === "TOTP" ? (
          <ManualTotpEntry handlerOnCandel={handleOnAddEntryCancel} handlerGoToHome={handlerGoToHome} />
        ) : manualEntryOptions === "MANUAL" ? (
          <ManualEntry handlerOnCandel={handleOnAddEntryCancel} />
        ) : (
          <Options setManualEntryOptions={setManualEntryOptions} />
        )}
      </DialogContent>
    </Dialog>
  );
}
