import { captureQRCode } from "@components/AppBar";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import LinkIcon from "@mui/icons-material/Link";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import Button, { ButtonProps } from "@mui/material/Button";
import { t } from "@src/chrome/i18n";
import React from "react";

interface AddOptionsProps {
  setManualEntryOptions: React.Dispatch<React.SetStateAction<"" | "TOTP" | "MANUAL">>;
}

const buttonCommonProps: ButtonProps = {
  fullWidth: true,
  variant: "contained",
  disableElevation: true,
  sx: { justifyContent: "flex-start", textTransform: "none", fontWeight: "bold" },
};

export default function AddOptions(options: AddOptionsProps) {
  const { setManualEntryOptions } = options;
  return (
    <>
      <Button {...buttonCommonProps} startIcon={<QrCodeScannerIcon />} onClick={() => captureQRCode()}>
        {t("scanQRCode")}
      </Button>
      <Button
        {...buttonCommonProps}
        disabled
        startIcon={<KeyboardIcon />}
        onClick={() => setManualEntryOptions("MANUAL")}
      >
        {t("manualEntry")}
      </Button>
      <Button {...buttonCommonProps} startIcon={<LinkIcon />} onClick={() => setManualEntryOptions("TOTP")}>
        {t("totpUrl")}
      </Button>
    </>
  );
}
