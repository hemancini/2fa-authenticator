import SaveIcon from "@mui/icons-material/Save";
import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { sendMessageToBackgroundAsync } from "@src/chrome/message";
import { oauthSignInJS } from "@src/chrome/oauth";
import { useAsync } from "@src/hooks/useAsync";
import { useScreenSize } from "@src/hooks/useScreenSize";
import { useEntries } from "@src/stores/useEntries";
import React, { useState } from "react";

import { uploadAppdata } from "../../oauth";
import { useAuth } from "../../stores/useAuth";
import type { BackupDialogProps } from "./types";

export default function ExportDialog({ state: { setOpen } }: BackupDialogProps) {
  const { entries } = useEntries();
  const { isUpSm } = useScreenSize();
  const { token, setToken } = useAuth();

  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<undefined | string>(undefined);

  const formatter = new Intl.DateTimeFormat(navigator?.language, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
  });

  const formattedDate = formatter.format(new Date());
  const fileName = `backup-${formattedDate?.replace(/\//g, "-")}.json`;

  const { execute, isLoading, error } = useAsync(uploadAppdata);

  const handleClose = () => {
    setOpen(false);
  };

  const retryUploadAppdata = async (fileName: string, fileContent: string): Promise<void> => {
    oauthSignInJS();
    const token = await sendMessageToBackgroundAsync({ type: "oauth" });
    if (!token) return;
    setToken(token);
    const appData = await execute(token, fileName, fileContent);
    // console.log(JSON.stringify(appData, null, 2));
    if (appData?.error?.code === 401) {
      setFormError(appData?.error?.message);
      return;
    }
    if (!appData?.id) {
      setFormError("An error occurred while saving the backup.");
      return;
    }
    if (error) {
      setFormError(error.message);
      return;
    }
    setIsSuccess(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const fileName = formJson.fileName as string;

    if (!fileName.endsWith(".json")) {
      setFormError("The file name must end with .json");
      return;
    }

    const fileContent = JSON.stringify(Array.from(entries.values()));
    const appData = await execute(token, fileName, fileContent);
    // console.log(JSON.stringify(appData, null, 2));

    if (appData?.error?.code === 401) {
      // setFormError(appData?.error?.message);
      await retryUploadAppdata(fileName, fileContent);
      return;
    }

    if (!appData?.id) {
      setFormError("An error occurred while saving the backup.");
      return;
    }

    if (error) {
      setFormError(error.message);
      return;
    }

    setIsSuccess(true);
    // handleClose();
  };

  return (
    <Dialog
      open={true}
      fullScreen={!isUpSm}
      onClose={handleClose}
      PaperProps={{
        ...({
          component: "form",
          onSubmit: handleSubmit,
        } as any),
      }}
      sx={{
        "& .MuiDialogContent-root": {
          py: 1,
        },
      }}
    >
      {!isSuccess ? (
        <>
          <DialogTitle>Backup entries</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              To export the backup, please enter the name of the file. We will save the backup in JSON format.
            </DialogContentText>
            <TextField
              autoFocus
              required
              name="fileName"
              margin="dense"
              label="File Name"
              fullWidth
              variant="standard"
              defaultValue={fileName}
              onChange={() => setFormError(undefined)}
              error={!!formError}
              helperText={formError}
            />
          </DialogContent>
          <DialogActions sx={{ m: 1 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} sx={{ mx: 0.25 }} /> : <SaveIcon />}
              sx={{ minWidth: 100 }}
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </>
      ) : (
        <SuccessDialog handleClose={handleClose} />
      )}
    </Dialog>
  );
}

const SuccessDialog = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <>
      <DialogTitle>Success</DialogTitle>
      <DialogContent>
        <DialogContentText>The backup was successfully saved.</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ m: 1 }}>
        <Button onClick={handleClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </>
  );
};
