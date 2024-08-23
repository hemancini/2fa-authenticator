import AddEntryMenu from "@components/addNewEntry/Menu";
import Tooltip from "@components/CustomTooltip";
import CancelIcon from "@mui/icons-material/Cancel";
import MenuIcon from "@mui/icons-material/Menu";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Divider } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { t } from "@src/chrome/i18n";
import { sendMessageToBackground } from "@src/chrome/message";
import { IS_DEV } from "@src/config";
import { useScreenSize } from "@src/hooks/useScreenSize";
import useUrlHashState from "@src/hooks/useUrlHashState";
import AddEntryMenuLegacy from "@src/legacy/components/dialogs/AddEntryMenu";
import { useEntries } from "@src/stores/useEntries";
import { useEntriesUtils } from "@src/stores/useEntriesUtils";
import { useModalStore } from "@src/stores/useModal";
import { useEffect, useState } from "react";

import ErrorCaptureQR from "../dialogs/CaptureQR";
import MoreOptions from "./MoreOptions";

const defaultIconSize = { fontSize: 20 };

export default function CustomAppBar({
  drawerOpen,
  setDrawerOpen,
}: {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [captureQRError, setCaptureQRError] = useState<boolean>(false);
  const { isOpenModal: modal } = useModalStore();
  const [isEditing] = useUrlHashState("#/edit");

  const { isUpSm } = useScreenSize();

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, pr: "0 !important" }}>
        <Toolbar
          disableGutters
          variant="dense"
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1, minHeight: 40 }}
        >
          {!isEditing ? (
            <>
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
              <Typography
                textAlign="center"
                sx={{
                  fontSize: 16,
                  fontWeight: !IS_DEV && "bold",
                  // color: (theme) => theme.palette.mode === "dark" && theme.palette.primary.main,
                }}
              >
                {t("extensionName")}
              </Typography>
              <Box sx={{ display: "flex", minWidth: 30 }}>
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
            </>
          ) : (
            <>
              <AppbarButton type="cancel" />
              <Divider orientation="vertical" flexItem sx={{ my: 1, mx: { xs: 3.5, md: 10 } }} />
              <AppbarButton type="save" />
            </>
          )}
        </Toolbar>
      </AppBar>
      <ErrorCaptureQR open={captureQRError} setOpen={setCaptureQRError} />
      {(isEditing || modal["add-entry-modal-legacy"]) && <AddEntryMenuLegacy />}
      {(isEditing || modal["add-entry-modal"]) && <AddEntryMenu />}
    </>
  );
}

export const captureQRCode = async (setCaptureQRError?: React.Dispatch<React.SetStateAction<boolean>>) => {
  return new Promise((resolve, reject) => {
    sendMessageToBackground({
      message: { type: "captureQR", data: null },
      handleSuccess: (result) => {
        console.log("captureQRCode:", result);
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

interface ButtonProps {
  type?: "cancel" | "save";
  justifyContent?: "flex-start" | "flex-end" | "center";
}

const AppbarButton = ({ type = "cancel", justifyContent = "center" }: ButtonProps): JSX.Element => {
  const { removes, resetRemoves, entriesEdited, resetEntriesEdited } = useEntriesUtils();
  const { removeEntry, upsertEntry } = useEntries();
  const [, toggleEditing] = useUrlHashState("#/edit");

  const handleCancel = () => {
    resetRemoves();
    resetEntriesEdited();
    toggleEditing();
  };

  const onComplete = () => {
    toggleEditing();
    resetRemoves();
    resetEntriesEdited();
  };

  const handleSave = () => {
    removes?.forEach((hash) => removeEntry(hash));
    entriesEdited?.forEach((entry) => upsertEntry(entry));
    toggleEditing();
  };

  useEffect(() => {
    window.addEventListener("popstate", onComplete);
  });

  return (
    <Tooltip title={t(type)} disableInteractive>
      <Button
        fullWidth
        size="small"
        variant="text"
        startIcon={type === "cancel" ? <CancelIcon sx={defaultIconSize} /> : <SaveIcon sx={defaultIconSize} />}
        sx={{ color: "inherit", textTransform: "none", justifyContent, fontSize: 15 }}
        onClick={type === "cancel" ? handleCancel : handleSave}
      >
        {t(type)}
      </Button>
    </Tooltip>
  );
};
