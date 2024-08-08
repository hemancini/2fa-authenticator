import CustomItemButton from "@components/Options/CustomItemButton";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Divider, TextField } from "@mui/material";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import { sendMessageToBackgroundAsync } from "@src/chrome/message";
import { getAuthToken, oauthPopup, oauthSignInJS, removeCachedAuthToken, revokeAuthTokenJS } from "@src/chrome/oauth";
import { DEFAULT_POPUP_URL } from "@src/config";
import { useAsync } from "@src/hooks/useAsync";
import { useState } from "react";

import { useAuth } from "../stores/useAuth";
import ExportDialog from "./backup/ExportDialog";
import ShowDialog from "./backup/ShowDialog";

export default function Options() {
  const { token, setToken } = useAuth();
  const [showDialogOpen, setShowDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const { execute: executeGetAuthToken, isLoading: isLoadingGetAuthToken } = useAsync(getAuthToken);
  const { execute: executeRemoveCachedAuthToken, isLoading: isLoadingRemoveCachedAuthToken } =
    useAsync(removeCachedAuthToken);
  const { execute: executeRevokeAuthTokenJS, isLoading: isLoadingRevokeAuthTokenJS } = useAsync(revokeAuthTokenJS);
  const { execute: executeOauthPopup, isLoading: isLoadingOauthPopup } = useAsync(oauthPopup);

  const getToken = async () => {
    const token = await sendMessageToBackgroundAsync({ type: "oauth" });
    setToken(token);
  };

  const handleGetAuthToken = async () => {
    const token = await executeGetAuthToken();
    if (!token) return;
    setToken(token);
  };

  const handleRemoveCachedAuthToken = async () => {
    await executeRemoveCachedAuthToken(token);
    setToken(undefined);
  };

  const handleRevokeAuthTokenJS = async () => {
    await executeRevokeAuthTokenJS(token);
    setToken(undefined);
  };

  const handleOauthPopup = async () => {
    await executeOauthPopup();
    await getToken();
  };

  const handleOauthJS = async () => {
    oauthSignInJS();
    await getToken();
  };

  return (
    <main style={{ marginTop: 12, display: "grid", gap: 4 }}>
      <Paper variant="outlined" sx={{ my: 1 }}>
        <List sx={{ p: 0 }}>
          <CustomItemButton
            primary="Show backups"
            toolltip="Show backups"
            handleButton={() => setShowDialogOpen(true)}
            icon={<CloudSyncIcon />}
          />
          <Divider />
          <CustomItemButton
            primary="Export backup"
            toolltip="Export backup"
            handleButton={() => setExportDialogOpen(true)}
            icon={<CloudUploadIcon />}
          />
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ my: 1 }}>
        <List sx={{ p: 0 }}>
          <CustomItemButton
            primary="Popup"
            toolltip="Popup"
            handleButton={handleOauthPopup}
            isLoading={isLoadingOauthPopup}
          />
          <Divider />
          <CustomItemButton primary="Javascript" toolltip="Javascript" handleButton={handleOauthJS} />
          <Divider />
          <CustomItemButton
            primary="Revoke Auth Token"
            toolltip="Revoke Auth Token"
            handleButton={handleRevokeAuthTokenJS}
            isLoading={isLoadingRevokeAuthTokenJS}
            disabled={!token}
          />
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ my: 1 }}>
        <List sx={{ p: 0 }}>
          <CustomItemButton
            primary="Google Identity API"
            toolltip="Google Identity API"
            handleButton={handleGetAuthToken}
            isLoading={isLoadingGetAuthToken}
          />
          <Divider />
          <CustomItemButton
            primary="Remove Auth Token"
            toolltip="Remove Auth Token"
            handleButton={handleRemoveCachedAuthToken}
            isLoading={isLoadingRemoveCachedAuthToken}
            disabled={!token}
          />
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ my: 1 }}>
        <List sx={{ p: 0 }}>
          <CustomItemButton
            isNewTab
            primary="Open in browser"
            toolltip="Open in browser"
            handleButton={() =>
              chrome.tabs.create({
                url: chrome.runtime.getURL(DEFAULT_POPUP_URL),
              })
            }
          />
        </List>
      </Paper>
      <TextField
        size="small"
        label="Auth token"
        value={token ?? ""}
        onChange={(e) => setToken(e.target.value)}
        fullWidth
        sx={{ my: 1 }}
      />

      {showDialogOpen && <ShowDialog state={{ setOpen: setShowDialogOpen }} />}
      {exportDialogOpen && <ExportDialog state={{ setOpen: setExportDialogOpen }} />}
    </main>
  );
}
