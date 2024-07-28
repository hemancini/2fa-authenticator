import AddQrButton from "@components/dialogs/AddEntryButtons/AddQrButton";
import UploadImage from "@components/dialogs/AddEntryButtons/UploadImage";
import { ListItemImportBackup } from "@components/Options/Backup";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import LinkIcon from "@mui/icons-material/Link";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Button, { ButtonProps } from "@mui/material/Button";
import { t } from "@src/chrome/i18n";
import React, { useState } from "react";

interface AddOptionsProps {
  handleCloseModal: () => void;
  setManualEntryOptions: React.Dispatch<React.SetStateAction<"" | "TOTP" | "MANUAL">>;
}

const buttonCommonProps: ButtonProps = {
  fullWidth: true,
  variant: "contained",
  disableElevation: true,
  sx: {
    justifyContent: "flex-start",
    textTransform: "none",
    fontWeight: "bold",
    paddingRight: 0,
  },
};

export default function AddOptions(props: AddOptionsProps) {
  const { handleCloseModal, setManualEntryOptions } = props;
  const [isUploadImage, setUploadImage] = useState(false);
  const [isImageUploaded, setImageUploaded] = useState(false);

  const handleCancelButton = () => {
    setUploadImage(false);
    setImageUploaded(false);
  };

  const showUploadImage = (show: boolean | ((prevState: boolean) => boolean)) => {
    setUploadImage(show);
  };

  return (
    <>
      <AddQrButton
        showUploadImage={showUploadImage}
        isImageUploaded={isImageUploaded}
        buttonCommonProps={buttonCommonProps}
      />
      {!isUploadImage ? (
        <>
          <Button {...buttonCommonProps} startIcon={<LinkIcon />} onClick={() => setManualEntryOptions("TOTP")}>
            {t("totpUrl")}
          </Button>
          <Button {...buttonCommonProps} startIcon={<UploadFileIcon />} {...{ component: "label" }}>
            <ListItemImportBackup returnRaw />
          </Button>
          <Button {...buttonCommonProps} startIcon={<KeyboardIcon />} onClick={() => setManualEntryOptions("MANUAL")}>
            {t("manualEntry")}
          </Button>
        </>
      ) : (
        <UploadImage
          handleCloseModal={handleCloseModal}
          setImageUploaded={setImageUploaded}
          setUploadImageOption={handleCancelButton}
        />
      )}
    </>
  );
}
