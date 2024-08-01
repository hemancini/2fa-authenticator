import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Divider, List, ListItem, ListItemButton, ListItemText, Paper, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { t } from "@src/chrome/i18n";
import ImportBackup from "@src/components/Options/Backup/ImportBackup";
import CustomItemIcon from "@src/components/Options/CustomItemIcon";
import { useBackupStore } from "@src/stores/useBackup";
import { exportBackup } from "@src/utils/backup";

export default function Backup() {
  const { showMessage } = useBackupStore();

  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDownloadJson = async () => {
    try {
      const dataBlob = await exportBackup();
      const fileName = `${new Date().toISOString().split(".")[0]}.json`;
      const url = window.URL.createObjectURL(dataBlob);
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
