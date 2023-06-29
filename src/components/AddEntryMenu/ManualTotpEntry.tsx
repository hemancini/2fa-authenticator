import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import TextareaAutosize from "@mui/material/TextareaAutosize";
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
    `otpauth://totp/WOM:${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(
      10000 + Math.random() * 90000
    )}?secret=XL2P2GOOPTEI4HXL&issuer=WOM&period=30`
  );
  const [entry, setEntry] = useState<Entry>();
  const [open, setOpen] = useState(false);
  const regexTotp = /^otpauth:\/\/[^/]+\/[^:]+:[^/]+$/;

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Box>
      <Box mx={0.5} display="grid" gap={2} mb={2.5}>
        <TextareaAutosize
          minRows={3}
          maxRows={7}
          style={{
            maxHeight: 170,
            resize: "vertical",
          }}
          defaultValue={totp}
          disabled={!!entry}
          onChange={(e) => setTopt(e.target.value)}
        />
        {!regexTotp.test(totp) && <Alert severity="warning">This is a warning alert — check it out!</Alert>}
        {entry && (
          <TextareaAutosize
            minRows={3}
            maxRows={7}
            style={{
              maxHeight: 200,
              resize: "vertical",
            }}
            disabled={!!entry}
            defaultValue={JSON.stringify(entry, null, 4)}
            onChange={(e) => setTopt(e.target.value)}
          />
        )}
      </Box>
      <Box mt={1} display="grid" gap={2} gridTemplateColumns={!entry ? "1fr 1fr" : "1fr"}>
        {!entry ? (
          <>
            <Button size="small" variant="outlined" fullWidth onClick={handlerOnCandel}>
              Cancel
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
                      handleClick();
                      resolve(result);
                    },
                  });
                });
              }}
            >
              Add
            </Button>
          </>
        ) : (
          <Button size="small" variant="contained" fullWidth onClick={() => handlerGoToHome()}>
            Aceppt
          </Button>
        )}
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          This is a success message!
        </Alert>
      </Snackbar>
    </Box>
  );
}
