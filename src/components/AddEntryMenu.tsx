import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { captureQR } from "@src/models/actions";
import { useState } from "react";

export interface DialogTitleProps {
  children?: React.ReactNode;
  onClose: () => void;
}

export interface AddEntryProps {
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle fontSize={18} sx={{ m: 0, mb: 0.5, p: 0, px: 1.4 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 2,
            top: 1,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const ManualEntry = (props: AddEntryProps) => {
  const { onClose } = props;
  const [isAdvance, setAdvance] = useState(false);
  const [age, setAge] = useState("");

  const handleAdvanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdvance(event.target.checked);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <Box>
      <Box mx={0.5} display="grid" gap={2} mb={2.5}>
        <TextField label="issuer" size="small" />
        <TextField label="secret" size="small" />
        <FormGroup>
          <FormControlLabel
            label="Advance"
            onChange={handleAdvanceChange}
            sx={{ "&& span": { p: 0, pl: 1 }, "&& .MuiFormControlLabel-label": { pl: 0 } }}
            control={<Checkbox icon={<ArrowRightIcon />} checkedIcon={<ArrowDropDownIcon />} />}
          />
        </FormGroup>
        {isAdvance && (
          <>
            <TextField label="username" size="small" />
            <TextField label="period" size="small" type="number" />
            <FormControl size="small" fullWidth>
              <InputLabel>digits</InputLabel>
              <Select value={age} label="digits" onChange={handleChange}>
                <MenuItem value={10}>6</MenuItem>
                <MenuItem value={20}>8</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>type</InputLabel>
              <Select value={age} label="type" onChange={handleChange}>
                <MenuItem value={10}>Time base</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>algorithm</InputLabel>
              <Select value={age} label="algorithm" onChange={handleChange}>
                <MenuItem value={10}>SHA-1</MenuItem>
                <MenuItem value={20}>SHA-256</MenuItem>
                <MenuItem value={30}>SHA-512</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
      </Box>
      <Box mt={1} display="grid" gap={2} gridTemplateColumns="1fr 1fr">
        <Button size="small" variant="outlined" fullWidth onClick={onClose}>
          Cancel
        </Button>
        <Button size="small" variant="contained" fullWidth>
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default function AddEntryMenu({
  isAddEntryMenuOpen,
  setAddEntryMenuOpen,
}: {
  isAddEntryMenuOpen: boolean;
  setAddEntryMenuOpen: (isAddEntryMenuOpen: boolean) => void;
}) {
  const [isManualEntryOpen, setManualEntryOpen] = useState(false);

  const handleOnAddEntryClose = () => {
    setAddEntryMenuOpen(false);
    setTimeout(() => {
      setManualEntryOpen(false);
    }, 500);
  };

  const handleOnAddEntryManualClose = () => {
    setManualEntryOpen(false);
  };

  return (
    <Dialog
      open={isAddEntryMenuOpen}
      aria-labelledby="customized-dialog-title"
      onClose={handleOnAddEntryClose}
      sx={{ m: 0.5, p: 0, "& .MuiDialog-paper": { m: 1, p: 1, pb: 0, minWidth: 220 } }}
    >
      <BootstrapDialogTitle onClose={handleOnAddEntryClose}>Add new entry</BootstrapDialogTitle>
      <Divider />
      <DialogContent sx={{ px: 1, display: "grid", direction: "column", gap: 2 }}>
        {!isManualEntryOpen ? (
          <>
            <Button variant="contained" fullWidth onClick={() => captureQR()}>
              Scan QR Code
            </Button>
            <Button variant="contained" fullWidth>
              Otp auth url
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setManualEntryOpen(true);
              }}
            >
              Manual Entry
            </Button>
          </>
        ) : (
          <ManualEntry onClose={handleOnAddEntryManualClose} />
        )}
      </DialogContent>
      {/* <DialogActions>
        <Button autoFocus onClick={handleOnAddEntryClose}>
            Save changes
          </Button>
      </DialogActions> */}
    </Dialog>
  );
}
