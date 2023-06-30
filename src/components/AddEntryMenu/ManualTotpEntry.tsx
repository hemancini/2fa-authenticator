import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { t } from "@src/chrome/i18n";
import { sendMessageToBackground } from "@src/chrome/message";
import EntriesContext from "@src/contexts/Entries";
import React, { useContext, useState } from "react";

export interface AddEntryProps {
  handlerOnCandel: () => void;
  handlerGoToHome?: () => void;
}

export default function ManualTotpEntry(props: AddEntryProps) {
  const { handlerOnCandel, handlerGoToHome } = props;
  const { updateEntriesState } = useContext(EntriesContext);
  const [totp, setTopt] = useState(
    ""
    // `otpauth://totp/WOM:${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(
    //   10000 + Math.random() * 90000
    // )}?secret=XL2P2GOOPTEI4HXL&issuer=WOM&period=30`
  );
  const [entry, setEntry] = useState<Entry>();
  const regexTotp = /^otpauth:\/\/[^/]+\/[^:]+:[^/]+$/;

  return (
    <Box mx={0.5}>
      <Box display="grid" gap={2} mb={2.5}>
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
          <Alert severity="success" sx={{ width: "auto" }}>
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
              onClick={async () => {
                return new Promise((resolve) => {
                  sendMessageToBackground({
                    message: { type: "getTotp2", data: { url: totp } },
                    handleSuccess: (result) => {
                      updateEntriesState("all");
                      setEntry(result);
                      resolve(result);
                    },
                  });
                });
              }}
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
