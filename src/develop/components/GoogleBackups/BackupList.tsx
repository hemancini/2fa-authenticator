import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Button, CircularProgress, DialogActions, Divider, List, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { sendMessageToBackgroundAsync } from "@src/chrome/message";
import { oauthLogin } from "@src/chrome/oauth";
import { useScreenSize } from "@src/hooks/useScreenSize";
import { useEffect, useState } from "react";

import { Appdata, getListAppdata } from "../../oauth";
import { useAuth } from "../../stores/useAuth";
import CustomListItem from "./CustomListItem";

interface BackupListProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BackupList({ setOpen }: BackupListProps) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | undefined>();
  const [listAppdata, setListAppdata] = useState<Appdata[]>();

  const { isXs } = useScreenSize();
  const { token, setToken, loginType } = useAuth();

  const appdataNotFound = listAppdata?.length === 0;

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setLoginError(undefined);
  };

  const handleRetry = async () => {
    setLoading(true);
    setLoginError(undefined);
    await retryGetListAppdata();
    setLoading(false);
  };

  const retryGetListAppdata = async (): Promise<void> => {
    await oauthLogin(loginType); // Open the OAuth
    const token = await sendMessageToBackgroundAsync({ type: "oauth" }).catch((error) => {
      console.warn(error?.message);
      setLoginError(error?.message);
      return "";
    });
    if (!token) return;

    setToken(token);
    const appDatas = await getListAppdata(token);
    setListAppdata(appDatas.files);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const appDatas = await getListAppdata(token);
      // console.log(JSON.stringify(appDatas, null, 2));
      if ([401, 403].includes(appDatas?.error?.code)) {
        // console.warn(appDatas?.error?.message);
        await retryGetListAppdata();
        setLoading(false);
        return;
      }
      setListAppdata(appDatas.files);
      setLoading(false);
    })();
  }, []);

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      // maxWidth={false}
      fullWidth={true}
      sx={{
        "& .MuiDialogContent-root": { p: 1, pb: 2 },
        "& .MuiDialogActions-root": { py: 0.5 },
      }}
    >
      <DialogTitle sx={{ py: 1 }}>Backups</DialogTitle>
      <Divider />
      <IconButton
        size="small"
        aria-label="close"
        onClick={handleClose}
        sx={{
          top: 5,
          right: 5,
          position: "absolute",
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ minHeight: !isXs && 200 }}>
        {isLoading && !loginError && (
          <CustomFlexBox>
            <CircularProgress size={50} />
            <Typography>Loading...</Typography>
          </CustomFlexBox>
        )}
        {loginError && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 120,
              gap: 2,
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 40 }} />
            <Typography>{loginError}</Typography>
          </Box>
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
        {loginError && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              mb: 1.5,
            }}
          >
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleRetry} variant="contained" sx={{ px: 4 }}>
              Retry
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 2, pr: 2 }}>
        <Button autoFocus onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
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
