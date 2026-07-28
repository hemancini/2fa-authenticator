import AddIcon from "@mui/icons-material/Add";
import KeyIcon from "@mui/icons-material/Key";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { t } from "@src/chrome/i18n";
import { useModalStore } from "@src/stores/useModal";

export default function NotEntriesFound() {
  const { toggleModal } = useModalStore();
  return (
    <div style={{ display: "grid", placeItems: "center", gap: 20 }}>
      <div style={{ display: "grid", placeItems: "center", textAlign: "center" }}>
        <KeyIcon color="disabled" style={{ marginTop: 30, fontSize: 80, transform: "rotate(45deg)" }} />
        <Typography variant="h6">{t("notEntriesFound")}</Typography>
      </div>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => {
          toggleModal("add-entry-modal");
        }}
      >
        {t("addNewEntry")}
      </Button>
    </div>
  );
}
