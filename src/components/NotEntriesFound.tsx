import KeyIcon from "@mui/icons-material/Key";
import { t } from "@src/chrome/i18n";

export default function NotEntriesFound() {
  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <KeyIcon color="disabled" style={{ marginTop: 50, fontSize: 80, transform: "rotate(45deg)" }} />
      <p>{t("notEntriesFound")}</p>
    </div>
  );
}
