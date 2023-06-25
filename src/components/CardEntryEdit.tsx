import DragHandleIcon from "@mui/icons-material/DragHandle";
import { Card, CardContent, FormControl } from "@mui/material";
import Box from "@mui/material/Box";
import blue from "@mui/material/colors/blue";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import EntriesContext from "@src/contexts/Entries";
import { OTPEntry } from "@src/models/otp";
import { useContext } from "react";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
    fontSize: 14,
    width: "auto",
    padding: "1px 5px",
    transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
  },
}));

export default function OutlinedCard({ entry }: { entry: OTPEntry }) {
  const { entriesEdit, setEntriesEdit } = useContext(EntriesContext);

  const handleUpdateEntry = ({ hash, issuer, account }: { hash: string; issuer?: string; account?: string }) => {
    const index = entriesEdit.findIndex((entry) => entry.hash === hash);
    entriesEdit[index].issuer = issuer || entriesEdit[index].issuer;
    entriesEdit[index].account = account || entriesEdit[index].account;
    setEntriesEdit(entriesEdit);
  };

  return (
    <Card variant="outlined" sx={{ display: "flex", my: 1.7 }}>
      <CardContent sx={{ py: 0.3, pl: 1.5, pb: "0px !important" }}>
        <FormControl aria-label="issuer" sx={{ display: "flex", py: 0.6, pt: 0.5, width: "20ch" }}>
          <BootstrapInput
            defaultValue={entry.issuer}
            onChange={(e) => handleUpdateEntry({ hash: entry.hash, issuer: e.target.value })}
          />
        </FormControl>
        <Box aria-label="otp-code" display="flex" sx={{ ml: 1 }}>
          <Typography
            sx={{
              color: blue[500],
              fontWeight: "bold",
              fontSize: "1.9rem",
              letterSpacing: 12,
              lineHeight: 0.8,
            }}
          >
            ••••••
          </Typography>
        </Box>
        <FormControl aria-label="account" sx={{ display: "flex", py: 0.5, pb: 0.8, width: "20ch" }}>
          <BootstrapInput
            defaultValue={entry.account}
            onChange={(e) => handleUpdateEntry({ hash: entry.hash, account: e.target.value })}
          />
        </FormControl>
      </CardContent>
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ pl: 1 }}>
        <IconButton size="large">
          <DragHandleIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>
    </Card>
  );
}
