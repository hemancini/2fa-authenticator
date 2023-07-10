import AddEntryMenu from "@components/AddEntryMenu";
import Tooltip from "@components/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
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
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Link } from "wouter";

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

const DoneButton = ({ setEntriesEdited }: { setEntriesEdited: Dispatch<SetStateAction<boolean>> }) => {
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
          setEntriesEdited(false);
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
  const [isEntriesEdit, setEntriesEdited] = useState(false);
  const [isAddEntryMenuOpen, setAddEntryMenuOpen] = useState(false);
  const [captureQRError, setCaptureQRError] = useState<boolean>(undefined);

  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));

  const handleEditEntries = () => {
    setDrawerOpen(false);
    setEntriesEdited(true);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, pr: "0 !important" }}>
        <Toolbar variant="dense" disableGutters sx={{ display: "flex", px: 1, minHeight: 40 }}>
          <Box sx={{ display: "flex", flexGrow: 1, width: 40 }}>
            {!isEntriesEdit && (
              <Tooltip title="Menu" placement="bottom" disableInteractive>
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
              </Tooltip>
            )}
          </Box>
          <Typography
            textAlign="center"
            sx={{
              fontSize: 17,
              fontWeight: "bold",
              // color: (theme) => theme.palette.mode === "dark" && theme.palette.primary.main,
            }}
          >
            {t("extensionName")}
          </Typography>
          <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}>
            {isEntriesEdit ? (
              <>
                <Tooltip title={t("addNewEntry")} disableInteractive>
                  <IconButton
                    size="small"
                    color="inherit"
                    aria-label="Add entry"
                    onClick={() => {
                      setAddEntryMenuOpen(true);
                    }}
                  >
                    <AddIcon sx={defaultIconSize} />
                  </IconButton>
                </Tooltip>
                <DoneButton setEntriesEdited={setEntriesEdited} />
              </>
            ) : (
              <Box minWidth={30}>
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
                  <Tooltip title={t("editEntries")} disableInteractive>
                    <IconButton
                      size="small"
                      color="inherit"
                      aria-label="Edit Entries"
                      LinkComponent={Link}
                      href="/entries/edit"
                      onClick={handleEditEntries}
                    >
                      <EditIcon sx={defaultIconSize} />
                    </IconButton>
                  </Tooltip>
                </>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <DialogCaptureQR open={captureQRError} setOpen={setCaptureQRError} />
      {isEntriesEdit && (
        <AddEntryMenu
          isAddEntryMenuOpen={isAddEntryMenuOpen}
          setAddEntryMenuOpen={setAddEntryMenuOpen}
          setEntriesEdited={setEntriesEdited}
        />
      )}
    </>
  );
}
