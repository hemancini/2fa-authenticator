import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { t } from "@src/chrome/i18n";
import * as React from "react";

export default function DialogCaptureQR({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleClose = () => {
    window.close();
    setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} sx={{ "& .MuiDialog-paper": { mx: 1.5 } }}>
      <DialogTitle sx={{ "&&": { p: 1, textAlign: "center" } }}>
        <Alert severity="warning" icon={false} sx={{ fontWeight: "bold" }}>
          {t("errorNoActiveTab")}
        </Alert>
      </DialogTitle>
      <DialogContent sx={{ "&&": { p: 1 } }}>
        <Alert
          severity="warning"
          icon={false}
          sx={{ backgroundColor: (theme) => theme.palette.grey[100], color: (theme) => theme.palette.grey[700] }}
        >
          {t("errorNoActiveTabDesc")}
        </Alert>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-around", mb: 1 }}>
        <Button size="small" variant="contained" onClick={handleClose} autoFocus fullWidth>
          {t("accept")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
