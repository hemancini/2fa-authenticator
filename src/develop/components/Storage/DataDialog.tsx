import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { STORAGE_ENTRIES_KEY } from "@src/config";
import { useScreenSize } from "@src/hooks/useScreenSize";

import { type IData, useStorageAreas } from "../../stores/useStorageAreas";
import EditablePre from "./EditablePre";
import MoreMenu from "./MoreMenu";
import StringifyEntries from "./StringifyEntries";

interface DataDialogProps {
  open: boolean;
  data: IData;
  dataContent: string;
  setDataContent: React.Dispatch<React.SetStateAction<string>>;
  handleCloseModal: () => void;
}

export default function DataDialog({ open, data, dataContent, setDataContent, handleCloseModal }: DataDialogProps) {
  const { isEditing, saveDataContent } = useStorageAreas();
  const { isDownSm } = useScreenSize();

  const handleSaveData = () => {
    const valueContent = typeof data.value === "object" ? JSON.parse(dataContent) : dataContent;
    saveDataContent({ ...data, value: valueContent });
    handleCloseModal();
  };

  return (
    open && (
      <Dialog onClose={handleCloseModal} open={open} fullScreen={isDownSm}>
        <DialogTitle sx={{ m: 0, p: 1, px: 2, minWidth: 130 }}>{data.title ?? ""}</DialogTitle>
        <MoreMenu {...{ data, closeDialog: handleCloseModal }} />
        <DialogContent dividers>
          <EditablePre {...{ dataContent, setDataContent }} />
          {data.title === STORAGE_ENTRIES_KEY && <StringifyEntries data={data.value as string} />}
        </DialogContent>
        <DialogActions sx={{ p: 1, px: 2 }}>
          {isEditing ? (
            <>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button onClick={handleSaveData} variant="contained">
                Save
              </Button>
            </>
          ) : (
            <Button onClick={handleCloseModal}>OK</Button>
          )}
        </DialogActions>
      </Dialog>
    )
  );
}
