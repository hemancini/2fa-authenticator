import CustomItemButton from "@components/Options/CustomItemButton";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LogoutIcon from "@mui/icons-material/Logout";
import { Divider, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { revokeAuthTokenJS } from "@src/chrome/oauth";
import { useAuth } from "@src/develop/stores/useAuth";
import { useAsync } from "@src/hooks/useAsync";
import { useState } from "react";

import BackupList from "./BackupList";
import ExportBackup from "./ExportBackup";

export default function GoogleBackups({ isPage = false }: { isPage?: boolean }) {
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
            primary="Show Google backups"
            toolltip="Show Google backups"
            handleButton={() => setBackupListOpen(true)}
            icon={<CloudSyncIcon />}
          />
          <Divider />
          <CustomItemButton
            primary="Export backups to Google"
            toolltip="Export backups to Google"
            handleButton={() => setExportBackupOpen(true)}
            icon={<CloudUploadIcon />}
          />
          <Divider />
          <CustomItemButton
            primary="Revoke session"
            toolltip="Revoke session"
            handleButton={handleRevokeAuthTokenJS}
            isLoading={isLoadingRevokeAuthTokenJS}
            disabled={!token}
            icon={<LogoutIcon />}
          />
        </List>
      </Paper>
      {isPage && (
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
