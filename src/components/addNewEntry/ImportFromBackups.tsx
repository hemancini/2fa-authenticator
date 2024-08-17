import ImportLocalBackup from "@components/Backup/ImportBackup";
import CustomItemButton from "@components/Options/CustomItemButton";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Box, Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import { t } from "@src/chrome/i18n";
import { useState } from "react";

import BackupList from "../GoogleBackups/BackupList";
import { useAddType } from "./useAddType";

const buttonVersion = false;

export function ImportFromBackupsButton() {
  const { setAddType } = useAddType();

  const handleImportBackups = () => {
    setAddType("import-backups");
  };

  return (
    <>
      <Divider />
      <CustomItemButton
        primary={"Import from backups"}
        toolltip={"Import from backups"}
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
        {buttonVersion ? (
          <>
            <Button
              size="small"
              variant="contained"
              onClick={() => setBackupListOpen(true)}
              startIcon={<CloudDownloadIcon />}
              sx={{
                textTransform: "none",
                display: "flex",
                justifyContent: "flex-start",
                // fontWeight: "bold",
                "& .MuiButton-startIcon": {
                  mr: 1,
                },
              }}
            >
              {t("showGooglebackups")}
            </Button>

            <Button
              size="small"
              tabIndex={-1}
              component="label"
              role={undefined}
              variant="contained"
              htmlFor="update-file-button"
              startIcon={<UploadFileIcon />}
              sx={{
                textTransform: "none",
                display: "flex",
                justifyContent: "flex-start",
                // fontWeight: "bold",
                "& .MuiButton-startIcon": {
                  mr: 1,
                },
              }}
            >
              <ImportLocalBackup returnRaw />
            </Button>
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CustomItemButton
                primary={t("showGooglebackups")}
                toolltip={t("showGooglebackups")}
                handleButton={() => setBackupListOpen(true)}
                icon={<CloudDownloadIcon />}
              />
              <Divider />
            </Box>
            <ImportLocalBackup />
          </>
        )}
        {backupListOpen && <BackupList {...{ setOpen: setBackupListOpen }} />}
      </Box>
      <Box sx={{ display: "flex", mt: 2 }}>
        <Button size="small" variant="outlined" onClick={handleCancel} sx={{ ml: 4, px: 2 }}>
          {t("back")}
        </Button>
      </Box>
    </>
  );
}
