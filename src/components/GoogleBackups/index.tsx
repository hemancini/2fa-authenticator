import CustomItemButton from "@components/Options/CustomItemButton";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LogoutIcon from "@mui/icons-material/Logout";
import { Divider, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { t } from "@src/chrome/i18n";
import { revokeAuthTokenJS } from "@src/chrome/oauth";
import { IS_DEV } from "@src/config";
import { useAuth } from "@src/develop/stores/useAuth";
import { useAsync } from "@src/hooks/useAsync";
import { useState } from "react";

import BackupList from "./BackupList";
import ExportBackup from "./ExportBackup";

interface GoogleBackupProps {
  isPage?: boolean;
  showDetail?: boolean;
}

export default function GoogleBackups({ isPage = false, showDetail = false }: GoogleBackupProps) {
  const { token, setToken } = useAuth();
  const [backupListOpen, setBackupListOpen] = useState(false);
  const [exportBackupOpen, setExportBackupOpen] = useState(false);

  const { execute: executeRevokeAuthTokenJS, isLoading: isLoadingRevokeAuthTokenJS } = useAsync(revokeAuthTokenJS);

  const handleRevokeAuthTokenJS = async () => {
    await executeRevokeAuthTokenJS(token);
    setToken(undefined);
  };

  return (
    <main style={{ display: "grid", gap: 4, marginTop: isPage && 12 }}>
      <Paper variant="outlined" sx={{ my: 1 }}>
        <List sx={{ p: 0 }}>
          <CustomItemButton
            primary={t("showGooglebackups")}
            toolltip={t("showGooglebackups")}
            handleButton={() => setBackupListOpen(true)}
            icon={<CloudDownloadIcon />}
          />
          <Divider />
          <CustomItemButton
            primary={t("exportBackupsToGoogle")}
            toolltip={t("exportBackupsToGoogle")}
            handleButton={() => setExportBackupOpen(true)}
            icon={<CloudUploadIcon />}
          />
          <Divider />
          <CustomItemButton
            primary={t("revokeGoogleToken")}
            toolltip={t("revokeGoogleToken")}
            handleButton={handleRevokeAuthTokenJS}
            isLoading={isLoadingRevokeAuthTokenJS}
            disabled={!token}
            icon={<LogoutIcon />}
          />
        </List>
      </Paper>
      {showDetail && IS_DEV && (
        <>
          <SelectLoginType />
          <TextField
            size="small"
            label="Auth token"
            value={token ?? ""}
            onChange={(e) => setToken(e.target.value)}
            fullWidth
            sx={{ my: 1 }}
          />
        </>
      )}

      {backupListOpen && <BackupList {...{ setOpen: setBackupListOpen }} />}
      {exportBackupOpen && <ExportBackup {...{ setOpen: setExportBackupOpen }} />}
    </main>
  );
}

function SelectLoginType() {
  const { loginType, setLoginType } = useAuth();

  const handleChange = (event: SelectChangeEvent) => {
    setLoginType(event.target.value as "popup" | "js");
  };

  return (
    <FormControl size="small" sx={{ my: 1 }} fullWidth>
      <InputLabel>Login type</InputLabel>
      <Select value={loginType} label="Login type" onChange={handleChange}>
        <MenuItem value="popup">Popup</MenuItem>
        <MenuItem value="js">Javascript</MenuItem>
      </Select>
    </FormControl>
  );
}
