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
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { sendMessageToBackground } from "@src/chrome/message";
import EntriesContext from "@src/contexts/Entries";
import { useContext, useState } from "react";
import { Link } from "wouter";

import DialogCaptureQR from "./DialogCaptureQR";

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

const toolbarMinHeight = 45;
const defaultIconSize = { fontSize: 20 };

const Offset = styled("div")(({ theme }) => {
  theme.mixins.toolbar.minHeight = toolbarMinHeight;
  return theme.mixins.toolbar;
});

export default function ButtonAppBar({
  draweOpen,
  setDrawerOpen,
}: {
  draweOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isEntriesEdit, setEntriesEdited] = useState(false);
  const [isAddEntryMenuOpen, setAddEntryMenuOpen] = useState(false);
  const { onSaveEdited, setOnSaveEdited } = useContext(EntriesContext);
  const [captureQRError, setCaptureQRError] = useState<boolean>(undefined);

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, pr: "0 !important" }}>
        <Toolbar disableGutters sx={{ display: "flex", px: 1, minHeight: toolbarMinHeight }}>
          <Box sx={{ display: "flex", flexGrow: 1, width: 22 }}>
            {!isEntriesEdit && (
              <IconButton
                size="small"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(!draweOpen)}
              // onClick={() => {
              //   const windowType = "panel";
              //   chrome.windows.create({
              //     // url: chrome.extension.getURL("view/popup.html?popup=true"),
              //     url: "chrome-extension://nhcbljmllcdhpfbagjcjnhhmpbedhpeg/src/pages/popup/index.html?popup=false",
              //     type: windowType,
              //     height: window.innerHeight,
              //     width: window.innerWidth,
              //   });
              // }}
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
              // color: (theme) =>
              //   theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.light,
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
                <IconButton
                  size="small"
                  color="inherit"
                  aria-label="Edit OK"
                  LinkComponent={Link}
                  href="/"
                  onClick={() => {
                    setOnSaveEdited(!onSaveEdited);
                    setEntriesEdited(false);
                  }}
                >
                  <DoneIcon sx={defaultIconSize} />
                </IconButton>
              </>
            ) : (
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
        </Toolbar>
      </AppBar>
      <Offset />
      <DialogCaptureQR open={captureQRError} setOpen={setCaptureQRError} />
      <AddEntryMenu
        isAddEntryMenuOpen={isAddEntryMenuOpen}
        setAddEntryMenuOpen={setAddEntryMenuOpen}
        setEntriesEdited={setEntriesEdited}
      />
    </>
  );
}
