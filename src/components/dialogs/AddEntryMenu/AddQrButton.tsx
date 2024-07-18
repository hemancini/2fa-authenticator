import { captureQRCode } from "@components/widgets/AppBar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ImageIcon from "@mui/icons-material/Image";
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

const addQrOptionList = [
  { id: "scan", text: t("scanQRCode"), icon: <QrCodeScannerIcon /> },
  { id: "upload", text: t("uploadQrImage"), icon: <ImageIcon />, disabled: false },
];

export default function AddQrButton(props: {
  buttonCommonProps?: ButtonProps;
  isImageUploaded: boolean;
  showUploadImage: (show: boolean) => void;
}) {
  const { buttonCommonProps, showUploadImage, isImageUploaded } = props;
  const [isQrButtonOpen, setQrButtonOpen] = useState(false);
  const [qrOptionIndex, setQrOptionIndex] = useState(0);

  const qrButtonRef = useRef<HTMLDivElement>(null);

  const handleToggleClick = () => {
    if (addQrOptionList[qrOptionIndex].id === "scan") {
      captureQRCode();
    }
    if (addQrOptionList[qrOptionIndex].id === "upload") {
      showUploadImage(true);
    }
  };

  const handleToggle = () => {
    setQrButtonOpen((prevOpen) => !prevOpen);
  };

  const handlePopperClose = (event: Event) => {
    if (qrButtonRef.current && qrButtonRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setQrButtonOpen(false);
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    setQrOptionIndex(index);
    setQrButtonOpen(false);

    // change the state of the parent component
    const isUploadImage = index === 1;
    showUploadImage(isUploadImage);
  };

  return (
    !isImageUploaded && (
      <React.Fragment>
        <ButtonGroup variant="contained" ref={qrButtonRef} disableElevation>
          <Button {...buttonCommonProps} startIcon={addQrOptionList[qrOptionIndex].icon} onClick={handleToggleClick}>
            <Box component="span" sx={{ display: "flex" }}>
              {addQrOptionList[qrOptionIndex].text}
            </Box>
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
                <ClickAwayListener onClickAway={handlePopperClose}>
                  <MenuList autoFocusItem disablePadding>
                    {addQrOptionList.map(
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
    )
  );
}
