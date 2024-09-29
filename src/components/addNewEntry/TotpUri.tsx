import CustomItemButton from "@components/Options/CustomItemButton";
import LinkIcon from "@mui/icons-material/Link";
import { Alert, Box, Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { t } from "@src/chrome/i18n";
import { useEntries } from "@src/stores/useEntries";
import { newEntryFromUrl } from "@src/utils/entry";
import { useState } from "react";

import { useAddType } from "./useAddType";

export default function TotpUri() {
  const { addEntry } = useEntries();
  const [totp, setTopt] = useState("");

  const regexTotp = /^otpauth:\/\/totp\/.*[?&]secret=/;
  const { setAddType, setSuccessMessage } = useAddType();

  const handleCancel = () => {
    setAddType(undefined);
  };

  const handleAddEntry = () => {
    try {
      const newEntry = newEntryFromUrl(totp);
      addEntry(newEntry);

      setAddType("success");
      setSuccessMessage(t("addEntrySuccess", newEntry?.account ?? newEntry?.issuer));
    } catch (error) {
      setAddType("error");
      setSuccessMessage(error?.message);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextareaAutosize
        minRows={3}
        maxRows={7}
        style={{
          maxHeight: 170,
          resize: "vertical",
        }}
        placeholder="otpauth://totp/..."
        defaultValue={totp}
        onChange={(e) => setTopt(e.target.value)}
      />
      {totp.length >= 16 && !regexTotp.test(totp) && (
        <Alert severity="warning" sx={{ width: "auto" }}>
          {t("regexTotpError")}
        </Alert>
      )}
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Button size="small" variant="outlined" onClick={handleCancel}>
          {t("back")}
        </Button>
        <Button size="small" variant="contained" fullWidth onClick={handleAddEntry} disabled={!regexTotp.test(totp)}>
          {t("add")}
        </Button>
      </Box>
    </Box>
  );
}

export function TotpUriButton() {
  const { setAddType } = useAddType();

  const handleTOTPURI = () => {
    setAddType("totp-uri");
  };

  return (
    <>
      <Divider />
      <CustomItemButton
        primary={"TOTP URI"}
        toolltip={"TOTP URI"}
        handleButton={handleTOTPURI}
        icon={<LinkIcon />}
        disableLeftPadding
      />
    </>
  );
}
