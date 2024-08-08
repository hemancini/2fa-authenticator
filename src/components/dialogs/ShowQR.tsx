import { Dialog, DialogContent, Divider, Typography } from "@mui/material";
import type { OTPEntry } from "@src/entry/type";
import { QRCodeSVG } from "qrcode.react";
import * as React from "react";

export default function ShowQR({
  entry,
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  entry: OTPEntry;
}) {
  const defaultSize = 190;
  const { issuer = "", secret, account = "" } = entry || {};
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
      <Typography
        title={issuer}
        color="text.secondary"
        sx={{
          mx: 2,
          mt: 0.5,
          fontSize: 16,
          maxWidth: 180,
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {issuer} - {account}
      </Typography>
      <Divider />
      <DialogContent>{secret && <QRCodeSVG value={authURL} size={defaultSize} />}</DialogContent>
    </Dialog>
  );
}
