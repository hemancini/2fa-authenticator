import { captureQRCode } from "@components/AppBar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ImageIcon from "@mui/icons-material/Image";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import LinkIcon from "@mui/icons-material/Link";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import Box from "@mui/material/Box";
import Button, { ButtonProps } from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { t } from "@src/chrome/i18n";
import React, { useRef, useState } from "react";

interface AddOptionsProps {
  setManualEntryOptions: React.Dispatch<React.SetStateAction<"" | "TOTP" | "MANUAL">>;
}

const qrOptions = [
  { id: "scan", text: t("scanQRCode"), icon: <QrCodeScannerIcon /> },
  { id: "upload", text: t("uploadImage"), icon: <ImageIcon />, disabled: true },
];

const buttonCommonProps: ButtonProps = {
  fullWidth: true,
  variant: "contained",
  disableElevation: true,
  sx: { justifyContent: "flex-start", textTransform: "none", fontWeight: "bold" },
};

export default function AddOptions(options: AddOptionsProps) {
  const { setManualEntryOptions } = options;
  const [isQrButtonOpen, setQrButtonOpen] = useState(false);
  const [qrOptionIndex, setQrOptionIndex] = useState(0);
  const qrButtonRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    console.info(`You clicked ${qrOptions[qrOptionIndex].id}`);
    if (qrOptions[qrOptionIndex].id === "scan") {
      captureQRCode();
    }
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    setQrOptionIndex(index);
    setQrButtonOpen(false);
  };

  const handleToggle = () => {
    setQrButtonOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (qrButtonRef.current && qrButtonRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setQrButtonOpen(false);
  };

  return (
    <>
      <React.Fragment>
        <ButtonGroup variant="contained" ref={qrButtonRef} disableElevation>
          <Button {...buttonCommonProps} startIcon={qrOptions[qrOptionIndex].icon} onClick={handleClick}>
            {qrOptions[qrOptionIndex].text}
          </Button>
          <Button {...buttonCommonProps} size="small" fullWidth={false} onClick={handleToggle}>
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          sx={{ zIndex: 1 }}
          open={isQrButtonOpen}
          anchorEl={qrButtonRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper sx={{ minWidth: qrButtonRef.current?.offsetWidth }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem disablePadding>
                    {qrOptions.map(
                      (option, index) =>
                        index !== qrOptionIndex && (
                          <MenuItem
                            key={index}
                            disableGutters
                            disabled={option.disabled}
                            selected={index === qrOptionIndex}
                            onClick={(event) => handleMenuItemClick(event, index)}
                            sx={{ px: 1, pl: 1.5 }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                "& .MuiTypography-root": {
                                  fontSize: 14,
                                },
                                "& .MuiSvgIcon-root": {
                                  fontSize: 20,
                                },
                              }}
                            >
                              {option.icon}
                              <ListItemText primary={option.text} />
                            </Box>
                          </MenuItem>
                        )
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </React.Fragment>
      <Button
        {...buttonCommonProps}
        disabled
        startIcon={<KeyboardIcon />}
        onClick={() => setManualEntryOptions("MANUAL")}
      >
        {t("manualEntry")}
      </Button>
      <Button {...buttonCommonProps} startIcon={<LinkIcon />} onClick={() => setManualEntryOptions("TOTP")}>
        {t("totpUrl")}
      </Button>
    </>
  );
}
