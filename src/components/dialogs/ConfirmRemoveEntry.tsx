import Tooltip from "@components/CustomTooltip";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Button, Dialog, DialogActions, DialogContent, Divider, IconButton, Typography } from "@mui/material";
import { t } from "@src/chrome/i18n";
import { useEntriesUtils } from "@src/stores/useEntriesUtils";

type ConfirmRemoveEntryProps = {
  entry: OTPEntry;
  isConfirmOpen: boolean;
  setIsConfirmOpen: (open: boolean) => void;
};

export default function ConfirmRemoveEntry({ entry, isConfirmOpen, setIsConfirmOpen }: ConfirmRemoveEntryProps) {
  const { hash, account } = entry;
  const { addRemove } = useEntriesUtils();
  return (
    <>
      <IconButton
        aria-label="remove entry"
        onClick={() => setIsConfirmOpen(true)}
        sx={{
          color: "#e57373",
          width: 22,
          height: 22,
          position: "absolute",
          right: -9,
          top: -9,
        }}
      >
        <Tooltip title={t("removeEntry")} disableInteractive>
          <RemoveCircleIcon sx={{ fontSize: 15 }} />
        </Tooltip>
      </IconButton>
      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        sx={{ m: 0.5, p: 0, "& .MuiDialog-paper": { m: 1, p: 1 } }}
      >
        <DialogContent sx={{ p: 1, py: 1.5 }}>
          <Typography variant="body2" gutterBottom>
            <span
              dangerouslySetInnerHTML={{
                __html: t("confirmRemoveDescription", account),
              }}
            />
          </Typography>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button size="small" variant="outlined" fullWidth onClick={() => setIsConfirmOpen(false)}>
            {t("cancel")}
          </Button>
          <Button
            size="small"
            variant="contained"
            fullWidth
            onClick={() => {
              addRemove(hash);
            }}
            autoFocus
          >
            {t("remove")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
