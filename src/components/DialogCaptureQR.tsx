import { Box, Divider, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
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
    // window.close();
    // setTimeout(() => {s
    setOpen(false);
    // }, 200);s
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} sx={{ "& .MuiDialog-paper": { mx: 3 } }}>
      <Box sx={{ m: 1, p: 0.5 }}>
        <Typography variant="body2" textAlign="center" fontWeight="bold" color="text.primary">
          {t("errorNoActiveTab")}
        </Typography>
      </Box>
      <Divider sx={{ mx: 1 }} />
      <Box sx={{ m: 1, px: 1, py: 1.5 }}>
        <Typography variant="body2">{t("errorNoActiveTabDesc")}</Typography>
      </Box>
      <DialogActions sx={{ justifyContent: "space-around", mb: 1 }}>
        <Button size="small" variant="contained" onClick={handleClose} autoFocus fullWidth>
          {t("accept")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
