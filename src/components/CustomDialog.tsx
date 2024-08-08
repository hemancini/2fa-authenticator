import Tooltip from "@components/CustomTooltip";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import MuiDialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
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
  title?: React.ReactNode | string;
  content?: React.ReactNode;
  iconButton?: React.ReactNode;
  dialogTitleEnabled?: boolean;
  dialogActionsEnabled?: boolean;
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

export default function Dialog(props: EditAccountProps) {
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
      <CustomDialog onClose={handleClose} open={isOpen}>
        {dialogTitleEnabled && (
          <CustomDialogTitle onClose={handleClose}>{title ? title : "Dialog title"}</CustomDialogTitle>
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
      </CustomDialog>
    </>
  );
}

function CustomDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;
  return (
    <>
      <Box sx={{ m: 1, mb: 0.8, px: 1 }}>
        <Typography noWrap variant="body2" fontWeight="bold" color="text.primary" {...other}>
          {children}
          {onClose && (
            <Tooltip title={t("close")} disableInteractive>
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  position: "absolute",
                  top: { xs: 0 },
                  right: { xs: 0 },
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
              </IconButton>
            </Tooltip>
          )}
        </Typography>
      </Box>
      <Divider sx={{ mx: 1 }} />
    </>
  );
}

const CustomDialog = styled(MuiDialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
