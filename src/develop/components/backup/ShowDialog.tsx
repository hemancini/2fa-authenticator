import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  CircularProgress,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { sendMessageToBackgroundAsync } from "@src/chrome/message";
import { oauthSignInJS } from "@src/chrome/oauth";
import { OTPEntry } from "@src/entry/otp";
import { useAsync } from "@src/hooks/useAsync";
import { useScreenSize } from "@src/hooks/useScreenSize";
import { useEntries } from "@src/stores/useEntries";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

import { Appdata, deleteAppdata, getAppdataContent, getListAppdata } from "../../oauth";
import { useAuth } from "../../stores/useAuth";
import type { BackupDialogProps } from "./types";

export default function ShowDialog({ state: { setOpen } }: BackupDialogProps) {
  const [listAppdata, setListAppdata] = useState<Appdata[]>();

  const { isUpSm } = useScreenSize();
  const { token, setToken } = useAuth();

  const appdataNotFound = listAppdata?.length === 0;

  const handleClose = () => {
    setOpen(false);
  };

  const retryGetListAppdata = async (): Promise<void> => {
    oauthSignInJS(); // Open the OAuth popup
    const token = await sendMessageToBackgroundAsync({ type: "oauth" });
    if (!token) return;
    setToken(token);
    const appDatas = await getListAppdata(token);
    setListAppdata(appDatas.files);
  };

  useEffect(() => {
    (async () => {
      const appDatas = await getListAppdata(token);
      // console.log(JSON.stringify(appDatas, null, 2));
      if (appDatas?.error?.code === 401) {
        // console.warn(appDatas?.error?.message);
        await retryGetListAppdata();
        return;
      }
      setListAppdata(appDatas.files);
    })();
  }, []);

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      fullScreen={!isUpSm}
      sx={(theme) => ({
        "& .MuiDialogContent-root": {
          padding: theme.spacing(1),
        },
        "& .MuiDialogActions-root": {
          padding: theme.spacing(1),
        },
      })}
    >
      <DialogTitle sx={{ m: 0, p: 1, px: 2 }}>Backups</DialogTitle>
      <IconButton
        size="small"
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 5,
          top: 5,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        dividers
        sx={{
          ...(isUpSm && { minWidth: 320, minHeight: 200 }),
        }}
      >
        {!listAppdata && (
          <CustomFlexBox>
            <CircularProgress size={50} />
            <Typography>Loading...</Typography>
          </CustomFlexBox>
        )}
        {appdataNotFound ? (
          <CustomFlexBox>
            <p>No backups found.</p>
          </CustomFlexBox>
        ) : (
          <List dense>
            {listAppdata?.map((data) => (
              <CustomListItem key={data.id} data={data} setListAppdata={setListAppdata} />
            ))}
          </List>
        )}
      </DialogContent>
      {appdataNotFound && (
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            OK
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

const CustomFlexBox = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      minHeight: 150,
      gap: 2,
    }}
  >
    {children}
  </Box>
);

const CustomListItem = ({
  data,
  setListAppdata,
}: {
  data: Appdata;
  setListAppdata: React.Dispatch<React.SetStateAction<Appdata[] | undefined>>;
}) => {
  const { token } = useAuth();
  const { setEntries } = useEntries();
  const [, setLocation] = useLocation();
  const { execute: executeData, isLoading: isLoadingData, error: errorData } = useAsync(getAppdataContent);
  const { execute: executeDelete, isLoading: isLoadingDelete, error: errorDelete } = useAsync(deleteAppdata);
  const isLoading = isLoadingData || isLoadingDelete;

  const handleGetAppdata = async (id: string) => {
    if (!confirm("Are you sure you want to load this backup?")) {
      return;
    }

    const appData = await executeData(token, id);
    if (errorData) {
      console.error("Error:", errorData);
      return;
    }

    const entriesBackup = JSON.parse(JSON.stringify(appData));
    const entriesMap = new Map(entriesBackup.map((entry: OTPEntry) => [entry.hash, entry])) as Map<string, OTPEntry>;

    setEntries(entriesMap);
    setLocation("/");
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

  return (
    <ListItem
      key={data.id}
      divider
      // disablePadding
      sx={{ pl: 0, "& .MuiListItemButton-root": { p: 0, px: 1 } }}
      secondaryAction={
        <IconButton
          edge="end"
          onClick={async () => await handleDeleteAppdata(data.id)}
          sx={{ ...(isLoading && { pointerEvents: "none" }) }}
        >
          {isLoading ? <CircularProgress size={24} /> : <DeleteIcon sx={{ fontSize: 20 }} />}
        </IconButton>
      }
    >
      <ListItemButton
        onClick={async () => await handleGetAppdata(data.id)}
        sx={{ ...(isLoadingData && { pointerEvents: "none" }) }}
      >
        <ListItemText
          primary={data.name}
        // secondary={item.modifiedTime}
        />
      </ListItemButton>
    </ListItem>
  );
};
