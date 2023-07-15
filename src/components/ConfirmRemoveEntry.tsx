import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
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
      <DialogContent sx={{ p: 1, py: 1.5 }}>
        <Typography variant="body2" gutterBottom>
          <span dangerouslySetInnerHTML={{ __html: t("confirmRemoveDescription", entry.account) }} />
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
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
