import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { OTPEntry } from "@src/models/otp";
import { QRCodeSVG } from "qrcode.react";
import * as React from "react";

export default function DialogQR({
  open,
  setOpen,
  entry,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  entry: OTPEntry;
}) {
  const defaultSize = 190;
  const issuer = entry.issuer;
  const secret = entry.secret;
  const account = entry.account;

  const authURL = `otpauth://totp/${account}?secret=${secret}&issuer=${issuer}`;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialogContent-root": { p: 2, pb: 1.2, background: "#ffffff" },
      }}
    >
      <DialogContent>{issuer && account && secret && <QRCodeSVG value={authURL} size={defaultSize} />}</DialogContent>
    </Dialog>
  );
}
