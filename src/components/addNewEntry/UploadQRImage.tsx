import CustomItemButton from "@components/Options/CustomItemButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import { Box, Button, Card, CardContent, styled, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { t } from "@src/chrome/i18n";
import { useEntries } from "@src/stores/useEntries";
import { newEntryFromUrl } from "@src/utils/entry";
import jsQR from "jsqr";
import { useState } from "react";

import { useAddType } from "./useAddType";

export default function UploadQRImage() {
  const [qrCode, setQrCode] = useState("");
  const [image, setImage] = useState(null);
  const [imageDetails, setImageDetails] = useState("");

  const { addEntry } = useEntries();
  const { setAddType, setSuccessMessage } = useAddType();

  const handleCancel = () => {
    setAddType(undefined);
  };

  const handleAddEntry = () => {
    try {
      const newEntry = newEntryFromUrl(qrCode);
      addEntry(newEntry);
      setAddType("success");
      setSuccessMessage(t("addEntrySuccess", newEntry?.account ?? newEntry?.issuer));
    } catch (error) {
      setAddType("error");
      setSuccessMessage(error?.message);
    }
  };

  const handleImageChange = (event: { target: { files: FileList } }) => {
    const file = event.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // size in MB
      const isValidSize = fileSize <= 2; // Max size of 2MB
      if (!isValidSize) {
        setAddType("error");
        setSuccessMessage(t("fileSizeError"));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImageDetails(`Resolution: ${img.width}x${img.height}px, Size: ${fileSize.toFixed(2)}MB`);
          setImage(e.target.result as string);

          // canvas for QR code decoding
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            const url = new URL(code.data);
            setQrCode(url.href);
          } else {
            setQrCode("No QR code detected");
          }
        };
        img.src = e.target.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {image ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ maxWidth: 200, marginInline: "auto" }}>
            <img src={image} alt="Uploaded" style={{ maxWidth: 160, height: "auto", marginInline: "auto" }} />
            {/* Hidden input for uploading another image */}
            <div style={{ display: "none", textAlign: "center", justifyItems: "center", marginTop: 20 }}>
              <input type="file" accept="image/*" onChange={handleImageChange} id="upload-another" hidden />
              <label
                htmlFor="upload-another"
                style={{
                  marginInline: "auto",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CloudUploadIcon fontSize="small" sx={{ mr: 1 }} />
                <span>Upload another</span>
              </label>
            </div>
          </div>
          <div style={{ fontSize: 12, textAlign: "center", marginBottom: 6 }}>{imageDetails}</div>
        </div>
      ) : (
        <UploadCard>
          <CardContent>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="file-input"
              onChange={handleImageChange}
            />
            <label htmlFor="file-input">
              <IconContainer>
                <CloudUploadIcon fontSize="small" />
              </IconContainer>
              <Typography sx={{ textAlign: "center", color: "#555", fontSize: 12 }}>Click or drag and drop</Typography>
              <Typography sx={{ textAlign: "center", color: "#777", fontSize: 12 }}>
                SVG, PNG, JPG or GIF (MAX. 2MB)
              </Typography>
            </label>
          </CardContent>
        </UploadCard>
      )}
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Button size="small" variant="outlined" onClick={handleCancel}>
          {t("back")}
        </Button>
        <Button size="small" variant="contained" fullWidth onClick={handleAddEntry} disabled={!qrCode}>
          {t("add")}
        </Button>
      </Box>
    </Box>
  );
}

export function UploadQRImageButton() {
  const { setAddType } = useAddType();

  const handleUploadQRImage = () => {
    setAddType("upload-qr-image");
  };

  return (
    <>
      <Divider />
      <CustomItemButton
        primary={"Upload QR Image"}
        toolltip={"Upload QR Image"}
        handleButton={handleUploadQRImage}
        icon={<ImageIcon />}
        disableLeftPadding
      />
    </>
  );
}

const UploadCard = styled(Card)({
  width: "auto",
  minWidth: 210,
  height: 110,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px dashed #ccc",
  boxSizing: "border-box",
  marginInline: "auto",
  "&:hover": {
    cursor: "pointer",
  },
});

const IconContainer = styled("div")({
  width: 10,
  height: 10,
  margin: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginInline: "auto",
  marginTop: 15,
});
