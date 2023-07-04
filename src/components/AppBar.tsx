import AddEntryMenu from "@components/AddEntryMenu";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { sendMessageToBackground } from "@src/chrome/message";
import EntriesContext from "@src/contexts/Entries";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Link } from "wouter";

import DialogCaptureQR from "./DialogCaptureQR";
import ToolbarOffset from "./ToolbarOffset";

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
  );
};

export default function ButtonAppBar({
  draweOpen,
  setDrawerOpen,
}: {
  draweOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isEntriesEdit, setEntriesEdited] = useState(false);
  const [isAddEntryMenuOpen, setAddEntryMenuOpen] = useState(false);
  const [captureQRError, setCaptureQRError] = useState<boolean>(undefined);

  const urlObj = new URL(decodeURIComponent(window.location.href));
  const isPopup = urlObj.searchParams.get("popup") === "true";

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, pr: "0 !important" }}>
        <Toolbar variant="dense" disableGutters sx={{ display: "flex", px: 1 }}>
          <Box sx={{ display: "flex", flexGrow: 1, width: 22 }}>
            {!isEntriesEdit && (
              <IconButton
                size="small"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(!draweOpen)}
              >
                <MenuIcon />
              </IconButton>
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
            Authenticator
          </Typography>
          <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}>
            {isEntriesEdit ? (
              <>
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
                <DoneButton setEntriesEdited={setEntriesEdited} />
              </>
            ) : (
              <Box minWidth={30}>
                {!isPopup && (
                  <>
                    <IconButton
                      size="small"
                      color="inherit"
                      aria-label="Scan QR"
                      onClick={() => captureQRCode(setCaptureQRError)}
                    >
                      <QrCodeScannerIcon sx={defaultIconSize} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="inherit"
                      aria-label="Edit Entries"
                      LinkComponent={Link}
                      href="/entries/edit"
                      onClick={() => {
                        setDrawerOpen(false);
                        setEntriesEdited(true);
                      }}
                    >
                      <EditIcon sx={defaultIconSize} />
                    </IconButton>
                  </>
                )}
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <ToolbarOffset />
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
