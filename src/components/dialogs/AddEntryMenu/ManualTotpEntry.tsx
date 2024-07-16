import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { t } from "@src/chrome/i18n";
import { sendMessageToBackground } from "@src/chrome/message";
import EntriesContext from "@src/contexts/legacy/Entries";
import { useContext, useState } from "react";

export interface AddEntryProps {
  handlerOnCandel: () => void;
  handlerGoToHome?: () => void;
}

export default function ManualTotpEntry(props: AddEntryProps) {
  const { handlerOnCandel, handlerGoToHome } = props;
  const { handleEntriesUpdate } = useContext(EntriesContext);
  const [totp, setTopt] = useState("");
  const [entry, setEntry] = useState<Entry>();
  const regexTotp = /^otpauth:\/\/totp\/.*[?&]secret=/;

  const handleSubmited = async () => {
    return new Promise((resolve) => {
      sendMessageToBackground({
        message: { type: "getTotp", data: { url: totp } },
        handleSuccess: (result) => {
          handleEntriesUpdate();
          setEntry(result);
          resolve(result);
        },
      });
    });
  };

  return (
    <Box mx={0.5}>
      <Box display="grid" gap={2} mb={2.5} mt={0}>
        {!entry && (
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
        )}
        {totp.length >= 16 && !regexTotp.test(totp) && (
          <Alert severity="warning" sx={{ width: "auto" }}>
            {t("regexTotpError")}
          </Alert>
        )}
        {entry && (
          <Alert severity="success" sx={{ width: "auto", mb: 0.8 }}>
            {t("addEntrySuccess")}
          </Alert>
        )}
      </Box>
      <Box mt={1} display="grid" gap={2} gridTemplateColumns={!entry ? "1fr 1fr" : "1fr"}>
        {!entry ? (
          <>
            <Button size="small" variant="outlined" fullWidth onClick={handlerOnCandel}>
              {t("cancel")}
            </Button>
            <Button
              size="small"
              variant="contained"
              fullWidth
              disabled={!regexTotp.test(totp)}
              onClick={handleSubmited}
            >
              {t("add")}
            </Button>
          </>
        ) : (
          <Button size="small" variant="contained" fullWidth onClick={() => handlerGoToHome()}>
            {t("accept")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
