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
import EntriesContext from "@src/contexts/Entries";
import { captureQR } from "@src/models/actions";
import { useContext, useState } from "react";
import { Link } from "wouter";

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
  const [isEntriesEdit, setEntriesEdit] = useState(false);
  const [isAddEntryMenuOpen, setAddEntryMenuOpen] = useState(false);
  const { onSaveEdit, setOnSaveEdit } = useContext(EntriesContext);
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
              // onClick={() => setDrawerOpen(!draweOpen)}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
          <Typography textAlign="center" sx={{ fontSize: 17, fontWeight: "bold" }}>
            Authenticator
          </Typography>
          <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}>
            {isEntriesEdit ? (
              <>
                <IconButton
                  size="small"
                  color="inherit"
                  aria-label="Add entry"
                  onClick={() => setAddEntryMenuOpen(true)}
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
                    setOnSaveEdit(!onSaveEdit);
                    setEntriesEdit(false);
                  }}
                >
                  <DoneIcon sx={defaultIconSize} />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton size="small" color="inherit" aria-label="Scan QR" onClick={() => captureQR()}>
                  <QrCodeScannerIcon sx={defaultIconSize} />
                </IconButton>
                <IconButton
                  size="small"
                  color="inherit"
                  aria-label="Edit Entries"
                  LinkComponent={Link}
                  href="/entries/edit"
                  onClick={() => setEntriesEdit(true)}
                >
                  <EditIcon sx={defaultIconSize} />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Offset />
      <AddEntryMenu isAddEntryMenuOpen={isAddEntryMenuOpen} setAddEntryMenuOpen={setAddEntryMenuOpen} />
    </>
  );
}
