import Tooltip from "@components/CustomTooltip";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { t } from "@src/chrome/i18n";
import { useModalStore } from "@src/stores/useDynamic";
import { useState } from "react";
import { useLocation } from "wouter";

import AddRandom from "../../develop/components/AddRandom";
import ManualEntry from "./AddEntryButtons/ManualEntry";
import ManualTotpEntry from "./AddEntryButtons/ManualTotpEntry";
import OptionsButtonList from "./AddEntryButtons/OptionsButtonList";

export interface AddEntryProps {
  handlerOnCandel: () => void;
  handleOnAddEntryClose?: () => void;
}

export interface AddEntryMenuProps {
  setEntriesEdited: (isEntriesEdited: boolean) => void;
}

export default function AddEntryMenu() {
  const [manualEntryOptions, setManualEntryOptions] = useState<"" | "TOTP" | "MANUAL">("");
  const [, navigate] = useLocation();
  const { isOpenModal, toggleModal } = useModalStore();

  const handleOnAddEntryClose = () => {
    toggleModal("add-entry-modal");
    setTimeout(() => {
      setManualEntryOptions("");
    }, 500);
  };

  const handleOnAddEntryCancel = () => {
    setManualEntryOptions("");
  };

  const handlerGoToHome = () => {
    handleOnAddEntryClose();
    navigate("/", { replace: true }); // `replaceState` is used
  };

  return (
    <Dialog
      open={isOpenModal["add-entry-modal"] || false}
      onClose={handleOnAddEntryClose}
      sx={{
        mx: 3,
        "& .MuiDialog-paper": { minWidth: { xs: "100%", sm: "30%" }, pb: 0.5 },
      }}
    >
      <DialogTitle
        fontSize={18}
        sx={{
          m: 1,
          p: 1.2,
          py: 0.2,
          pr: 4,
          fontWeight: "bold",
          fontSize: { xs: 14, sm: 18 },
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        {t("addNewEntry")}
        <IconButton
          aria-label="close"
          onClick={handleOnAddEntryClose}
          sx={{
            top: 4,
            right: 5,
            position: "absolute",
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Tooltip title={t("cancel")} disableInteractive>
            <CloseIcon sx={{ fontSize: 18 }} />
          </Tooltip>
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent
        sx={{
          py: 3,
          px: 1,
          mx: 1,
          display: "grid",
          direction: "column",
          gap: 3,
        }}
      >
        {manualEntryOptions === "TOTP" ? (
          <ManualTotpEntry handlerOnCandel={handleOnAddEntryCancel} handlerGoToHome={handlerGoToHome} />
        ) : manualEntryOptions === "MANUAL" ? (
          <ManualEntry handlerOnCandel={handleOnAddEntryCancel} handlerGoToHome={handlerGoToHome} />
        ) : (
          <OptionsButtonList handleCloseModal={handlerGoToHome} setManualEntryOptions={setManualEntryOptions} />
        )}
        {manualEntryOptions === "" && <AddRandom />}
      </DialogContent>
    </Dialog>
  );
}
