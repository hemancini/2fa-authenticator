import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { t } from "@src/chrome/i18n";
import { useEntries } from "@src/stores/useEntries";
import { newEntryFromUrl } from "@src/utils/entry";
import jsQR from "jsqr";
import { useState } from "react";

export default function UploadImage(props: {
  handleCloseModal: () => void;
  setImageUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadImageOption: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { handleCloseModal, setImageUploaded, setUploadImageOption } = props;
  const [image, setImage] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [imageDetails, setImageDetails] = useState("");
  const { addEntry } = useEntries();

  const handleImageChange = (event: { target: { files: FileList } }) => {
    const file = event.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // size in MB
      const isValidSize = fileSize <= 2; // Max size of 2MB
      if (!isValidSize) {
        alert("File size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImageDetails(`Resolution: ${img.width}x${img.height}px, Size: ${fileSize.toFixed(2)}MB`);
          setImage(e.target.result as string);
          setImageUploaded(true);

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
            setQrCode(code.data);
          } else {
            setQrCode("No QR code detected");
          }
        };
        img.src = e.target.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEntry = () => {
    const newEntry = newEntryFromUrl(qrCode);
    addEntry(newEntry);

    setImageUploaded(false);
    handleCloseModal();
  };

  return image ? (
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
      <Box display="grid" gap={2} gridTemplateColumns={"1fr 1fr"}>
        <Button size="small" variant="outlined" fullWidth onClick={() => setUploadImageOption(false)}>
          {t("cancel")}
        </Button>
        <Button fullWidth size="small" variant="contained" onClick={() => handleAddEntry()}>
          {t("add")}
        </Button>
      </Box>
    </div>
  ) : (
    <UploadCard>
      <CardContent>
        <input type="file" accept="image/*" style={{ display: "none" }} id="file-input" onChange={handleImageChange} />
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
  cursor: "pointer",
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
