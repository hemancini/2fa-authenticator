import ImportLocalBackup from "@components/Backup/ImportBackup";
import CustomItemButton from "@components/Options/CustomItemButton";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import { Box, Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import { t } from "@src/chrome/i18n";
import { useState } from "react";

import BackupList from "../GoogleBackups/BackupList";
import { useAddType } from "./useAddType";

export function ImportFromBackupsButton() {
  const { setAddType } = useAddType();

  const handleImportBackups = () => {
    setAddType("import-backups");
  };

  return (
    <>
      <Divider />
      <CustomItemButton
        primary={t("importFromBackups")}
        toolltip={t("importFromBackups")}
        handleButton={handleImportBackups}
        icon={<CloudSyncIcon />}
        disableLeftPadding
      />
    </>
  );
}

export default function ImportFromBackups() {
  const [backupListOpen, setBackupListOpen] = useState(false);
  const { setAddType } = useAddType();

  const handleCancel = () => {
    setAddType(undefined);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CustomItemButton
            primary={t("showGooglebackups")}
            toolltip={t("showGooglebackups")}
            handleButton={() => setBackupListOpen(true)}
            icon={<CloudDownloadIcon />}
            disableLeftPadding
          />
          <Divider />
        </Box>
        <ImportLocalBackup disableLeftPadding />
        {backupListOpen && <BackupList {...{ setOpen: setBackupListOpen }} />}
      </Box>
      <Box sx={{ display: "flex", mt: 3 }}>
        <Button size="small" variant="outlined" onClick={handleCancel} sx={{ ml: 3, px: 2 }}>
          {t("back")}
        </Button>
      </Box>
    </>
  );
}
