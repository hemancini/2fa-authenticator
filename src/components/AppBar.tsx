import AddEntryMenu from "@components/AddEntryMenu";
import Tooltip from "@components/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import MenuIcon from "@mui/icons-material/Menu";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { t } from "@src/chrome/i18n";
import { sendMessageToBackground } from "@src/chrome/message";
import EntriesContext from "@src/contexts/Entries";
import { useActionStore, useModalStore } from "@src/stores/useDynamicStore";
import { useContext, useState } from "react";
import { Link } from "wouter";

import AppbarMenu from "./AppbarMenu";
import DialogCaptureQR from "./DialogCaptureQR";

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

const DoneButton = () => {
  const { toggleAction } = useActionStore();
  const { handleEntriesEdited } = useContext(EntriesContext);
  return (
    <Tooltip title={t("save")} disableInteractive>
      <IconButton
        size="small"
        color="inherit"
        aria-label="Edit OK"
        LinkComponent={Link}
        href="/"
        onClick={() => {
          handleEntriesEdited();
          toggleAction("entries-edit-state");
        }}
      >
        <DoneIcon sx={defaultIconSize} />
      </IconButton>
    </Tooltip>
  );
};

export default function ButtonAppBar({
  drawerOpen,
  setDrawerOpen,
}: {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [captureQRError, setCaptureQRError] = useState<boolean>(false);
  const { modal, toggleModal } = useModalStore();
  const { actionState } = useActionStore();

  const isDev = import.meta.env.VITE_IS_DEV === "true";

  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, pr: "0 !important" }}>
        <Toolbar variant="dense" disableGutters sx={{ display: "flex", px: 1, minHeight: 40 }}>
          <Box sx={{ display: "flex", flexGrow: 1, width: 40 }}>
            {!actionState["entries-edit-state"] && (
              <Tooltip title="Menu" placement="bottom" disableInteractive>
                <span>
                  <IconButton
                    size="small"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    disabled={isUpSm}
                    onClick={() => setDrawerOpen(!drawerOpen)}
                  >
                    <MenuIcon />
                  </IconButton>
                </span>
              </Tooltip>
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
            {isDev && " dev"}
          </Typography>
          <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}>
            {actionState["entries-edit-state"] ? (
              <>
                <Tooltip title={t("addNewEntry")} disableInteractive>
                  <IconButton
                    size="small"
                    color="inherit"
                    aria-label="Add entry"
                    onClick={() => toggleModal("add-entry-modal")}
                  >
                    <AddIcon sx={defaultIconSize} />
                  </IconButton>
                </Tooltip>
                <DoneButton />
              </>
            ) : (
              <Box minWidth={30} sx={{ display: "flex" }}>
                <>
                  <Tooltip title={t("scanQRCode")} disableInteractive>
                    <IconButton
                      size="small"
                      color="inherit"
                      aria-label="Scan QR"
                      onClick={() => captureQRCode(setCaptureQRError)}
                    >
                      <QrCodeScannerIcon sx={defaultIconSize} />
                    </IconButton>
                  </Tooltip>
                  <AppbarMenu />
                </>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <DialogCaptureQR open={captureQRError} setOpen={setCaptureQRError} />
      {(actionState["entries-edit-state"] || modal["add-entry-modal"]) && <AddEntryMenu />}
    </>
  );
}
