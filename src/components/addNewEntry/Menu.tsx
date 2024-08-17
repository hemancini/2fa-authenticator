import Tooltip from "@components/CustomTooltip";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import { t } from "@src/chrome/i18n";
import { IS_DEV } from "@src/config";
import { useModalStore } from "@src/stores/useModal";
import { useEffect, useState } from "react";

import ImportFromBackups, { ImportFromBackupsButton } from "./ImportFromBackups";
import Manual, { ManualButton } from "./Manual";
import { ErrorMesssage, SuccessMessage } from "./Messages";
import { RandomButton } from "./Random";
import { ScanQRCodeButton } from "./ScanQRCode";
import TotpUri, { TotpUriButton } from "./TotpUri";
import UploadQRImage, { UploadQRImageButton } from "./UploadQRImage";
import { useAddType } from "./useAddType";

export default function AddEntryMenu() {
  const [prevAddEntryType, setPrevAddEntryType] = useState<AddType>();

  const { addType, setAddType } = useAddType();
  const { isOpenModal, toggleModal } = useModalStore();

  const handleClose = () => {
    setAddType(undefined);
    toggleModal("add-entry-modal");
  };

  useEffect(() => {
    if (addType !== "error") setPrevAddEntryType(addType);
  }, [addType]);

  return (
    <Dialog
      open={isOpenModal["add-entry-modal"] || false}
      onClose={handleClose}
      sx={{
        "& .MuiDialogContent-root": { p: 2, px: 1 },
      }}
    >
      <DialogTitle
        sx={{
          m: 1,
          p: 1.2,
          py: 0.2,
          pr: 4,
          fontWeight: "bold",
          fontSize: { xs: 14, sm: 18 },
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        {t("addNewEntry")}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            top: 4,
            right: 5,
            position: "absolute",
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Tooltip title={t("cancel")} disableInteractive>
            <CloseIcon sx={{ fontSize: 18 }} />
          </Tooltip>
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <List sx={{ p: 0 }}>
          {!addType && <ScanQRCodeButton />}
          {!addType && <UploadQRImageButton />}
          {!addType && <TotpUriButton />}
          {!addType && <ImportFromBackupsButton />}
          {!addType && <ManualButton />}
          {IS_DEV && !addType && <RandomButton />}

          {addType === "upload-qr-image" && <UploadQRImage />}
          {addType === "totp-uri" && <TotpUri />}
          {addType === "import-backups" && <ImportFromBackups />}
          {addType === "manual" && <Manual />}

          {addType === "error" && <ErrorMesssage lastType={prevAddEntryType} />}
          {addType === "success" && <SuccessMessage />}
        </List>
      </DialogContent>
    </Dialog>
  );
}
