import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import { OTPEntry } from "@src/models/otp";
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
  const issuer = entry.issuer;
  const secret = entry.secret;
  const account = entry.account;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
      <DialogContent sx={{ width: 200, height: 200 }}>
        {issuer && secret && account && (
          <img
            src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=200x200&chld=M|0&cht=qr&chl=otpauth://totp/${issuer}@${account}%3Fsecret%3D${secret}`}
            alt="QR Code"
          />
        )}
      </DialogContent>
    </BootstrapDialog>
  );
}
