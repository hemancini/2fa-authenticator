import AddIcon from "@mui/icons-material/Add";
import KeyIcon from "@mui/icons-material/Key";
import Button from "@mui/material/Button";
import { t } from "@src/chrome/i18n";
import { useModalStore } from "@src/stores/useModalStore";

export default function NotEntriesFound() {
  const { toggleModal } = useModalStore();
  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <KeyIcon color="disabled" style={{ marginTop: 50, fontSize: 80, transform: "rotate(45deg)" }} />
      <p>{t("notEntriesFound")}</p>
      <div style={{ marginTop: 20 }}>
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
    </div>
  );
}
