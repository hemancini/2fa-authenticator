import Tooltip from "@components/CustomTooltip";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Button, Card, CardContent, Dialog, DialogActions, IconButton, Typography } from "@mui/material";
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
        sx={{
          "& .MuiDialog-paper": { m: 1, px: 1, py: 2, gap: 2 },
          "& .MuiCardContent-root:last-child": { p: 1 },
          "& .MuiDialogActions-root": { p: 0, gap: 1 },
          "& .MuiTypography-root": { pb: 0 },
        }}
      >
        <Card variant="outlined">
          <CardContent>
            <Typography
              gutterBottom
              variant="body2"
              dangerouslySetInnerHTML={{
                __html: t("confirmRemoveDescription", account),
              }}
            />
          </CardContent>
        </Card>
        <DialogActions>
          <Button size="small" variant="outlined" sx={{ px: 4 }} onClick={() => setIsConfirmOpen(false)}>
            {t("cancel")}
          </Button>
          <Button
            autoFocus
            fullWidth
            size="small"
            variant="contained"
            onClick={() => {
              addRemove(hash);
            }}
          >
            {t("remove")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
