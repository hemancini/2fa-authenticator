import ConfirmRemoveEntry from "@components/ConfirmRemoveEntry";
import Tooltip from "@components/Tooltip";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Card, CardContent, FormControl } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { t } from "@src/chrome/i18n";
import EntriesContext from "@src/contexts/Entries";
import { OTPEntry } from "@src/models/otp";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { useContext, useState } from "react";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    fontSize: 14,
    borderRadius: 4,
    padding: "1px 5px",
    position: "relative",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
    backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
    "&:focus": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function CardEntryEdit({
  entry,
  handleRender,
}: {
  entry: OTPEntry;
  handleRender: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { entriesEdited, setEntriesEdited } = useContext(EntriesContext);

  const dragMotion = useMotionValue(0);
  const dragControls = useDragControls();

  const handleUpdateEntry = ({ hash, issuer, account }: { hash: string; issuer?: string; account?: string }) => {
    const index = entriesEdited.findIndex((entry) => entry.hash === hash);
    if (issuer) entriesEdited[index].issuer = issuer;
    if (account) entriesEdited[index].account = account;
    setEntriesEdited(entriesEdited);
    handleRender((prevState) => !prevState);
  };

  const handleRemoveEntry = (hash: string) => {
    const index = entriesEdited.findIndex((entry) => entry.hash === hash);
    entriesEdited.splice(index, 1);
    setEntriesEdited(entriesEdited);
    setIsConfirmOpen(false);
    handleRender((prevState) => !prevState);
  };

  return (
    <Reorder.Item
      value={entry}
      dragListener={false}
      style={{ y: dragMotion }}
      id={entry.hash}
      dragControls={dragControls}
    >
      <Box sx={{ position: "relative" }}>
        <Card variant="outlined" sx={{ my: 1.7, display: "flex" }}>
          <CardContent sx={{ p: 0.6 }}>
            <FormControl aria-label="issuer" sx={{ display: "flex", width: "19ch" }}>
              <BootstrapInput
                defaultValue={entry.issuer}
                onChange={(e) =>
                  handleUpdateEntry({
                    hash: entry.hash,
                    issuer: e.target.value,
                  })
                }
              />
            </FormControl>
            <Box aria-label="otp-code" display="flex" sx={{ ml: 1 }}>
              <Typography
                component="span"
                sx={{
                  color: (theme) => theme.palette.primary.main,
                  fontWeight: "bold",
                  fontSize: "1.9rem",
                  letterSpacing: 12,
                  lineHeight: 1,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                ••••••
              </Typography>
            </Box>
            <FormControl aria-label="account" sx={{ display: "flex", width: "19ch" }}>
              <BootstrapInput
                defaultValue={entry.account}
                onChange={(e) =>
                  handleUpdateEntry({
                    hash: entry.hash,
                    account: e.target.value,
                  })
                }
              />
            </FormControl>
          </CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" width="100%">
            {/* <Tooltip title={t("dragEntry")} disableInteractive disableFocusListener> */}
            <IconButton size="large" aria-label="drag entry" onPointerDown={(event) => dragControls.start(event)}>
              <DragHandleIcon sx={{ fontSize: 40 }} />
            </IconButton>
            {/* </Tooltip> */}
          </Box>
        </Card>
        {!entry.pinned && (
          <>
            <IconButton
              aria-label="remove entry"
              onClick={() => setIsConfirmOpen(true)}
              sx={{
                color: "#e57373",
                width: 22,
                height: 22,
                position: "absolute",
                right: -9,
                top: -9,
              }}
            >
              <Tooltip title={t("removeEntry")} disableInteractive>
                <RemoveCircleIcon sx={{ fontSize: 15 }} />
              </Tooltip>
            </IconButton>
            <ConfirmRemoveEntry
              entry={entry}
              isConfirmOpen={isConfirmOpen}
              setIsConfirmOpen={setIsConfirmOpen}
              handleRemoveEntry={handleRemoveEntry}
            />
          </>
        )}
      </Box>
    </Reorder.Item>
  );
}
