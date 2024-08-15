import ImportBackup from "@components/Backup/ImportBackup";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Divider, List, ListItem, ListItemButton, ListItemText, Paper } from "@mui/material";
import { t } from "@src/chrome/i18n";
import CustomItemIcon from "@src/components/Options/CustomItemIcon";
import { useScreenSize } from "@src/hooks/useScreenSize";
import { useBackupStore } from "@src/stores/useBackup";
import { exportBackup } from "@src/utils/backup";

export default function Backup() {
  const { showMessage } = useBackupStore();

  const { isUpSm } = useScreenSize();

  const handleDownloadJson = async () => {
    try {
      const data = await exportBackup();
      const blobData = new Blob([JSON.stringify({ data }, null, 2)], { type: "application/json" });
      const fileName = `${new Date().toISOString().split(".")[0]}.json`;
      const url = window.URL.createObjectURL(blobData);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showMessage(error.cause ? t(error.cause) : error.message);
    }
  };

  return (
    <Paper variant="outlined" sx={{ my: 1 }}>
      <List sx={{ p: 0 }}>
        <ListItem disablePadding>
          <ListItemButton dense={!isUpSm} onClick={handleDownloadJson}>
            <CustomItemIcon>
              <FileDownloadIcon />
            </CustomItemIcon>
            <ListItemText primary={t("exportBackup")} />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ImportBackup />
      </List>
    </Paper>
  );
}
