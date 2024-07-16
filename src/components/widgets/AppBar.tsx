import AddEntryMenu from "@components/dialogs/AddEntryMenu";
import Tooltip from "@components/Tooltip";
import CancelIcon from "@mui/icons-material/Cancel";
import MenuIcon from "@mui/icons-material/Menu";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import SaveIcon from "@mui/icons-material/Save";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { t } from "@src/chrome/i18n";
import { sendMessageToBackground } from "@src/chrome/message";
import EntriesContext from "@src/contexts/legacy/Entries";
import useUrlHashState from "@src/hooks/useUrlHashState";
import { useActionStore, useModalStore } from "@src/stores/useDynamicStore";
import { useOptionsStore } from "@src/stores/useOptions";
import { useContext, useState } from "react";
import { Link } from "wouter";

import CaptureQR from "../dialogs/CaptureQR";
import MoreOptions from "./MoreOptions";

const defaultIconSize = { fontSize: 20 };

export const captureQRCode = async (setCaptureQRError?: React.Dispatch<React.SetStateAction<boolean>>) => {
  return new Promise((resolve, reject) => {
    sendMessageToBackground({
      message: { type: "captureQR", data: null },
      handleSuccess: (result) => {
        if (result === "received") {
          resolve(result);
          window.close();
        }
      },
      handleError: (error) => {
        setCaptureQRError((prevState) => !prevState);
        reject(error);
      },
    });
  });
};

export default function ButtonAppBar({
  drawerOpen,
  setDrawerOpen,
}: {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [captureQRError, setCaptureQRError] = useState<boolean>(false);
  const { modal } = useModalStore();
  const { actionState } = useActionStore();
  const [isEditing] = useUrlHashState("#/edit");

  const isDev = import.meta.env.VITE_IS_DEV === "true";

  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, pr: "0 !important" }}>
        <Toolbar variant="dense" disableGutters sx={{ display: "flex", px: 1, minHeight: 40 }}>
          <Box sx={{ display: "flex", flexGrow: 1, width: 40 }}>
            {isEditing || actionState["entries-edit-state"] ? (
              <CancelButton />
            ) : (
              <IconButton
                size="small"
                edge="start"
                color="inherit"
                aria-label="menu"
                disabled={isUpSm}
                onClick={() => setDrawerOpen(!drawerOpen)}
              >
                <Tooltip title="Menu" placement="bottom" disableInteractive>
                  <MenuIcon />
                </Tooltip>
              </IconButton>
            )}
          </Box>
          <Typography
            textAlign="center"
            sx={{
              fontSize: 16,
              fontWeight: !isDev && "bold",
              // color: (theme) => theme.palette.mode === "dark" && theme.palette.primary.main,
            }}
          >
            {t("extensionName")}
            {/* {isDev && " dev"} */}
          </Typography>
          <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}>
            {isEditing || actionState["entries-edit-state"] ? (
              <SaveButton />
            ) : (
              <Box minWidth={30} sx={{ display: "flex" }}>
                <IconButton
                  size="small"
                  color="inherit"
                  aria-label="Scan QR"
                  onClick={() => captureQRCode(setCaptureQRError)}
                >
                  <Tooltip title={t("scanQRCode")} disableInteractive>
                    <QrCodeScannerIcon sx={defaultIconSize} />
                  </Tooltip>
                </IconButton>
                <MoreOptions />
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <CaptureQR open={captureQRError} setOpen={setCaptureQRError} />
      {(isEditing || actionState["entries-edit-state"] || modal["add-entry-modal"]) && <AddEntryMenu />}
    </>
  );
}

const SaveButton = (): JSX.Element => {
  const { toggleAction } = useActionStore();
  const { handleEntriesEdited } = useContext(EntriesContext);
  const { isNewVersion } = useOptionsStore();
  const [_, toggleEditing] = useUrlHashState("#/edit");
  return (
    <IconButton
      size="small"
      color="inherit"
      aria-label={t("save")}
      LinkComponent={Link}
      href="/"
      onClick={() => {
        handleEntriesEdited();
        if (isNewVersion) {
          toggleEditing();
        } else {
          toggleAction("entries-edit-state");
        }
      }}
    >
      <Tooltip title={t("save")} disableInteractive>
        <SaveIcon sx={defaultIconSize} />
      </Tooltip>
    </IconButton>
  );
};

const CancelButton = (): JSX.Element => {
  const { toggleAction } = useActionStore();
  const { handleEntriesUpdate } = useContext(EntriesContext);
  const { isNewVersion } = useOptionsStore();
  const [, toggleEditing] = useUrlHashState("#/edit");
  return (
    <IconButton
      size="small"
      color="inherit"
      aria-label={t("cancel")}
      onClick={() => {
        handleEntriesUpdate();
        if (isNewVersion) {
          toggleEditing();
        } else {
          toggleAction("entries-edit-state");
        }
      }}
      LinkComponent={Link}
      href="/"
    >
      <Tooltip title={t("cancel")} disableInteractive>
        <CancelIcon sx={defaultIconSize} />
      </Tooltip>
    </IconButton>
  );
};
