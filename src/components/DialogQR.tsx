import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import { OTPEntry } from "@src/models/otp";
import { QRCodeSVG } from "qrcode.react";
import * as React from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

export default function CustomizedDialogs({
  open,
  setOpen,
  entry,
}: {
  open: boolean;
  entry: OTPEntry;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const defaultSize = 200;
  const issuer = entry.issuer;
  const secret = entry.secret;
  const account = entry.account;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <BootstrapDialog onClose={handleClose} open={open}>
      <DialogContent>
        {issuer && secret && account && (
          <QRCodeSVG value={`otpauth://totp/${issuer}@${account}?secret=${secret}`} size={defaultSize} />
        )}
      </DialogContent>
    </BootstrapDialog>
  );
}
