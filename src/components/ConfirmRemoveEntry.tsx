import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { t } from "@src/chrome/i18n";
import { OTPEntry } from "@src/models/otp";

export default function ConfirmRemoveEntry({
  entry,
  isConfirmOpen,
  setIsConfirmOpen,
  handleRemoveEntry,
}: {
  entry: OTPEntry;
  isConfirmOpen: boolean;
  setIsConfirmOpen: (isConfirmOpen: boolean) => void;
  handleRemoveEntry: (hash: string) => void;
}) {
  return (
    <Dialog
      open={isConfirmOpen}
      onClose={() => setIsConfirmOpen(false)}
      sx={{ m: 0.5, p: 0, "& .MuiDialog-paper": { m: 1, p: 1 } }}
    >
      <DialogContent sx={{ "&&": { p: 0, m: 0 } }}>
        <DialogContentText sx={{ p: 0, m: 1 }}>
          <Alert icon={false} severity="info">
            <p dangerouslySetInnerHTML={{ __html: t("confirmRemoveDescription", entry.account) }} />
          </Alert>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-around", mx: 0, gap: 2 }}>
        <Button size="small" variant="outlined" fullWidth onClick={() => setIsConfirmOpen(false)}>
          {t("cancel")}
        </Button>
        <Button size="small" variant="contained" autoFocus fullWidth onClick={() => handleRemoveEntry(entry.hash)}>
          {t("remove")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
