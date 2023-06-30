import { captureQRCode } from "@components/AppBar";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import LinkIcon from "@mui/icons-material/Link";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import Button from "@mui/material/Button";
import { t } from "@src/chrome/i18n";
import React from "react";

interface OptionsProps {
  setManualEntryOptions: React.Dispatch<React.SetStateAction<"" | "TOTP" | "MANUAL">>;
}

export default function Options(options: OptionsProps) {
  const { setManualEntryOptions } = options;
  return (
    <>
      <Button startIcon={<QrCodeScannerIcon />} variant="contained" fullWidth onClick={() => captureQRCode()}>
        {t("scanQRCode")}
      </Button>
      <Button
        startIcon={<KeyboardIcon />}
        fullWidth
        variant="contained"
        onClick={() => setManualEntryOptions("MANUAL")}
      >
        {t("manualEntry")}
      </Button>
      <Button startIcon={<LinkIcon />} variant="contained" fullWidth onClick={() => setManualEntryOptions("TOTP")}>
        {t("totpUrl")}
      </Button>
    </>
  );
}
