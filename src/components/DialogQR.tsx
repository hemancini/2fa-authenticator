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
  const defaultSize = 200;
  const issuer = entry.issuer;
  const secret = entry.secret;
  const account = entry.account;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ "& .MuiDialogContent-root": { p: 2, pb: 1.2, background: "#ffffff" } }}
    >
      <DialogContent>
        {issuer && account && secret && (
          <QRCodeSVG value={`otpauth://totp/${issuer}@${account}?secret=${secret}`} size={defaultSize} />
        )}
      </DialogContent>
    </Dialog>
  );
}
