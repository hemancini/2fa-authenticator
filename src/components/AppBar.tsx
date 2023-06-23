import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { captureQR } from "@src/models/actions";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

export default function ButtonAppBar({
  draweOpen,
  setDrawerOpen,
}: {
  draweOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, pr: "0 !important" }}>
        <Toolbar disableGutters sx={{ px: 1 }}>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="menu"
            // onClick={() => setDrawerOpen(!draweOpen)}
          >
            <MenuIcon />
          </IconButton>
          <Typography textAlign="center" variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Authenticator
          </Typography>
          <Box>
            <IconButton size="small" color="inherit" aria-label="Scan QR" onClick={captureQR}>
              <QrCodeScannerIcon />
            </IconButton>
            <IconButton size="small" color="inherit" aria-label="Edit">
              <EditIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Offset />
    </Box>
  );
}
