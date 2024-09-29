import Tooltip from "@components/CustomTooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress, ListItem, ListItemButton, ListItemText } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { t } from "@src/chrome/i18n";
import { OTPEntry } from "@src/entry/otp";
import { useAsync } from "@src/hooks/useAsync";
import { decryptBackup } from "@src/utils/backup";
import { useState } from "react";

import { Appdata, deleteAppdata, getAppdataContent } from "../../develop/oauth";
import { useAuth } from "../../develop/stores/useAuth";
import BackupDetail from "./BackupDetail";

interface CustomListItemProps {
  data: Appdata;
  setListAppdata: React.Dispatch<React.SetStateAction<Appdata[] | undefined>>;
}

export default function CustomListItem({ data, setListAppdata }: CustomListItemProps) {
  const { token } = useAuth();
  const [showDetail, setShowDetail] = useState(false);
  const [entries, setEntries] = useState<Map<string, OTPEntry>>(new Map());

  const { execute: executeData, isLoading: isLoadingData, error: errorData } = useAsync(getAppdataContent);
  const { execute: executeDelete, isLoading: isLoadingDelete, error: errorDelete } = useAsync(deleteAppdata);
  const isLoading = isLoadingData || isLoadingDelete;

  const handleGetAppdata = async (id: string) => {
    const appData = await executeData(token, id);
    if (errorData) {
      console.error("Error:", errorData);
      return;
    }
    // console.log("appData", appData);

    const otpEntries = decryptBackup(appData) as Map<string, OTPEntry>;
    // console.log("otpEntries", otpEntries);

    setEntries(otpEntries);
    setShowDetail(true);
  };

  const handleDeleteAppdata = async (id: string) => {
    if (!confirm(t("confirmDeleteBackup"))) {
      return;
    }

    const isDeleted = await executeDelete(token, id);
    if (errorDelete) {
      console.error("Error:", errorDelete);
      return;
    }
    if (isDeleted) {
      setListAppdata((prev) => prev?.filter((item) => item.id !== id));
    }
  };

  const handleClose = () => {
    setShowDetail(false);
  };

  return (
    <>
      <ListItem
        key={data.id}
        divider
        // disablePadding
        sx={{ pl: 0, pr: 4, "& .MuiListItemButton-root": { p: 0, px: 1 } }}
        secondaryAction={
          <Tooltip title={t("deleteBackup")}>
            <IconButton
              edge="end"
              onClick={async () => await handleDeleteAppdata(data.id)}
              sx={{ p: 0.3, ...(isLoading && { pointerEvents: "none" }) }}
            >
              {isLoading ? <CircularProgress size={24} /> : <DeleteIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>
        }
      >
        <ListItemButton
          onClick={async () => await handleGetAppdata(data.id)}
          sx={{ ...(isLoadingData && { pointerEvents: "none" }) }}
        >
          <Tooltip title={t("showBackups")}>
            <ListItemText
              // secondary={item.modifiedTime}
              primary={data.name}
              sx={{
                // width: 130,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
          </Tooltip>
        </ListItemButton>
      </ListItem>
      {showDetail && <BackupDetail title={data.name} entries={entries} handleClose={handleClose} />}
    </>
  );
}
