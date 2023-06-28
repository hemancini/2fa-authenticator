import { captureQRCode } from "@components/AppBar";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import LinkIcon from "@mui/icons-material/Link";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import Button from "@mui/material/Button";
import React from "react";
import { Link } from "wouter";

interface OptionsProps {
  setManualEntryOptions: React.Dispatch<React.SetStateAction<"" | "TOTP" | "MANUAL">>;
}

export default function Options(options: OptionsProps) {
  const { setManualEntryOptions } = options;
  return (
    <>
      <Button
        startIcon={<QrCodeScannerIcon />}
        variant="contained"
        fullWidth
        href="/"
        replace={true}
        component={Link}
        onClick={() => captureQRCode()}
      >
        Scan QR Code
      </Button>
      <Button
        startIcon={<KeyboardIcon />}
        fullWidth
        variant="contained"
        onClick={() => setManualEntryOptions("MANUAL")}
      >
        Manual Entry
      </Button>
      <Button startIcon={<LinkIcon />} variant="contained" fullWidth onClick={() => setManualEntryOptions("TOTP")}>
        Otp auth url
      </Button>
    </>
  );
}
