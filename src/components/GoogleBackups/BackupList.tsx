import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Button, CircularProgress, DialogActions, Divider, List, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import type { SxProps } from "@mui/material/styles";
import { t } from "@src/chrome/i18n";
import { sendMessageToBackgroundAsync } from "@src/chrome/message";
import { oauthLogin } from "@src/chrome/oauth";
import { Appdata, getListAppdata } from "@src/develop/oauth";
import { useAuth } from "@src/develop/stores/useAuth";
import { useScreenSize } from "@src/hooks/useScreenSize";
import { useEffect, useState } from "react";

import CustomListItem from "./CustomListItem";

interface BackupListProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BackupList({ setOpen }: BackupListProps) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | undefined>();
  const [listAppdata, setListAppdata] = useState<Appdata[]>();

  const { token, setToken, loginType } = useAuth();
  const { isXs } = useScreenSize();

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

    if (isXs) alert(`✅ Login succes`); // para mantener el popup abierto
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
      sx={{
        "& .MuiDialog-paper": { m: 1 },
        "& .MuiDialogTitle-root": { p: 1, pl: 2, pb: 0 },
        "& .MuiDialogContent-root": { p: 1, pb: 2, minHeight: 120, minWidth: 220 },
        "& .MuiDialogActions-root": { py: 0.5 },
      }}
    >
      <DialogTitle>{t("myBackups")}</DialogTitle>
      <Divider />
      <IconButton
        size="small"
        aria-label={t("close")}
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
      <DialogContent>
        {isLoading && !loginError && (
          <CustomFlexBox sx={{ minWidth: 200 }}>
            <CircularProgress size={50} sx={{ mt: 5 }} />
            <Typography>{t("loading")}</Typography>
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
            <Typography>{t("noBackupsFound")}</Typography>
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
            <Button onClick={handleClose}>{t("cancel")}</Button>
            <Button onClick={handleRetry} variant="contained" sx={{ px: 4 }}>
              {t("retry")}
            </Button>
          </Box>
        )}
      </DialogContent>
      {!loginError && (
        <DialogActions sx={{ pb: 2, pr: 2 }}>
          <Button autoFocus onClick={handleClose}>
            {t("close")}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

const CustomFlexBox = ({ children, sx = {} }: { children: React.ReactNode; sx?: SxProps }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: 120,
      gap: 2,
      ...sx,
    }}
  >
    {children}
  </Box>
);
