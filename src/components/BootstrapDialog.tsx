import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { t } from "@src/chrome/i18n";
import React from "react";

export interface DialogTitleProps {
  children?: React.ReactNode;
  onClose: () => void;
}

export interface EditAccountProps {
  title?: string;
  content?: React.ReactNode;
  iconButton?: React.ReactNode;
  dialogTitleEnabled?: boolean;
  dialogActionsEnabled?: boolean;
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          py: { xs: 0.5, sm: 1.5 },
          fontSize: { sx: 18, sm: 24 },
        }}
        {...other}
      >
        {children}
        {onClose && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              top: { xs: 2.5, sm: 8 },
              right: { xs: 4, sm: 8 },
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
          </IconButton>
        )}
      </DialogTitle>
      <Divider />
    </>
  );
}

export default function EditAccount(props: EditAccountProps) {
  const {
    title,
    content,
    iconButton,
    isOpen,
    handleOpen,
    handleClose,
    dialogTitleEnabled = true,
    dialogActionsEnabled = false,
  } = props;

  const iconButtonOnClick = React.cloneElement((iconButton as React.ReactElement) || <></>, {
    onClick: handleOpen,
  });

  return (
    <>
      {iconButton && iconButtonOnClick}
      <BootstrapDialog onClose={handleClose} open={isOpen}>
        {dialogTitleEnabled && (
          <BootstrapDialogTitle onClose={handleClose}>{title ? title : "Dialog title"}</BootstrapDialogTitle>
        )}
        <DialogContent>{content ? content : <Typography>Bootstrap dialog content</Typography>}</DialogContent>
        {dialogActionsEnabled && (
          <>
            <Divider />
            <DialogActions>
              <Button autoFocus disableElevation variant="contained" size="small" onClick={handleClose}>
                {t("accept")}
              </Button>
            </DialogActions>
          </>
        )}
      </BootstrapDialog>
    </>
  );
}
