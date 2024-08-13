import Tooltip from "@components/CustomTooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress, ListItem, ListItemButton, ListItemText } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { OTPEntry } from "@src/entry/otp";
import { useAsync } from "@src/hooks/useAsync";
import { useState } from "react";

import { Appdata, deleteAppdata, getAppdataContent } from "../../oauth";
import { useAuth } from "../../stores/useAuth";
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

    const entriesBackup = JSON.parse(JSON.stringify(appData));
    const entriesMap = new Map(entriesBackup.map((entry: OTPEntry) => [entry.hash, entry])) as Map<string, OTPEntry>;

    // alert(JSON.stringify(appData));
    setEntries(entriesMap);
    setShowDetail(true);
  };

  const handleDeleteAppdata = async (id: string) => {
    if (!confirm("Are you sure you want to delete this backup?")) {
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
          <Tooltip title="Delete backup">
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
          <Tooltip title="Show backup">
            <ListItemText
              primary={data.name}
              sx={{
                // width: 130,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              // secondary={item.modifiedTime}
            />
          </Tooltip>
        </ListItemButton>
      </ListItem>
      {showDetail && <BackupDetail entries={entries} handleClose={handleClose} />}
    </>
  );
}
