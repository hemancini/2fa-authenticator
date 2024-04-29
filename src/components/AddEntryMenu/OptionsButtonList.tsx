import KeyboardIcon from "@mui/icons-material/Keyboard";
import LinkIcon from "@mui/icons-material/Link";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Button, { ButtonProps } from "@mui/material/Button";
import { t } from "@src/chrome/i18n";
import React from "react";

import { ImportBackupListItem } from "../Options/Backup";
import AddQrButton from "./AddQrButton";

interface AddOptionsProps {
  setManualEntryOptions: React.Dispatch<React.SetStateAction<"" | "TOTP" | "MANUAL">>;
}

const buttonCommonProps: ButtonProps = {
  fullWidth: true,
  variant: "contained",
  disableElevation: true,
  sx: {
    justifyContent: "flex-start",
    textTransform: "none",
    fontWeight: "bold",
  },
};

export default function AddOptions(options: AddOptionsProps) {
  const { setManualEntryOptions } = options;

  return (
    <>
      <AddQrButton buttonCommonProps={buttonCommonProps} />
      <Button {...buttonCommonProps} startIcon={<KeyboardIcon />} onClick={() => setManualEntryOptions("MANUAL")}>
        {t("manualEntry")}
      </Button>
      <Button {...buttonCommonProps} startIcon={<LinkIcon />} onClick={() => setManualEntryOptions("TOTP")}>
        {t("totpUrl")}
      </Button>
      <Button {...buttonCommonProps} startIcon={<UploadFileIcon />} {...{ component: "label" }}>
        <ImportBackupListItem returnRaw />
      </Button>
    </>
  );
}
