import { captureQRCode } from "@components/AppBar";
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
import TextareaAutosize from "@mui/material/TextareaAutosize";
import TextField from "@mui/material/TextField";
import { sendMessageToBackground } from "@src/chrome/message";
import { useMemo, useState } from "react";

export interface AddEntryProps {
  handlerOnCandel: () => void;
}
export interface AddEntryMenuProps {
  isAddEntryMenuOpen: boolean;
  setAddEntryMenuOpen: (isAddEntryMenuOpen: boolean) => void;
}

const getTotp = (message: GetTotp) => {
  return new Promise((resolve) => {
    sendMessageToBackground({
      message,
      handleSuccess: (result) => {
        if (result === "received") {
          resolve(result);
        }
      },
    });
  });
};

const ManualEntry = (props: AddEntryProps) => {
  const { handlerOnCandel } = props;
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
        <Button size="small" variant="outlined" fullWidth onClick={handlerOnCandel}>
          Cancel
        </Button>
        <Button size="small" variant="contained" fullWidth>
          Add
        </Button>
      </Box>
    </Box>
  );
};

const ManualTotpEntry = (props: AddEntryProps) => {
  const { handlerOnCandel } = props;
  const data = "otpauth://totp/WOM:14514-55017?secret=XL2P2GOOPTEI4HXL&issuer=WOM";
  return (
    <Box>
      <Box mx={0.5} display="grid" gap={2} mb={2.5}>
        <TextareaAutosize minRows={3} maxRows={7} style={{ width: "100%" }} defaultValue={data}></TextareaAutosize>
      </Box>
      <Box mt={1} display="grid" gap={2} gridTemplateColumns="1fr 1fr">
        <Button size="small" variant="outlined" fullWidth onClick={handlerOnCandel}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          fullWidth
          onClick={async () => {
            const asd = await getTotp({ type: "getTotp", data: { text: data, fromPopup: true } });
            console.log("asd:", asd);
            alert(asd);
          }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default function AddEntryMenu({ isAddEntryMenuOpen, setAddEntryMenuOpen }: AddEntryMenuProps) {
  const [manualEntryOptions, setManualEntryOptions] = useState<"" | "TOTP" | "MANUAL">("");

  const handleOnAddEntryClose = () => {
    setAddEntryMenuOpen(false);
    setTimeout(() => {
      setManualEntryOptions("");
    }, 500);
  };

  const handleOnAddEntryCancel = () => {
    setManualEntryOptions("");
  };

  const SwitchMenu = () =>
    useMemo(() => {
      switch (manualEntryOptions) {
        case "TOTP":
          return <ManualTotpEntry handlerOnCandel={handleOnAddEntryCancel} />;
        case "MANUAL":
          return <ManualEntry handlerOnCandel={handleOnAddEntryCancel} />;
        default:
          return (
            <>
              <Button variant="contained" fullWidth onClick={() => captureQRCode()}>
                Scan QR Code
              </Button>
              <Button variant="contained" fullWidth onClick={() => setManualEntryOptions("TOTP")}>
                Otp auth url
              </Button>
              <Button fullWidth variant="contained" onClick={() => setManualEntryOptions("MANUAL")}>
                Manual Entry
              </Button>
            </>
          );
      }
    }, [manualEntryOptions]);

  return (
    <Dialog
      open={isAddEntryMenuOpen}
      aria-labelledby="customized-dialog-title"
      onClose={handleOnAddEntryClose}
      sx={{ m: 0.5, p: 0, "& .MuiDialog-paper": { m: 1, p: 1, pb: 0, minWidth: 220 } }}
    >
      <DialogTitle fontSize={18} sx={{ m: 0, mb: 0.5, p: 0, px: 1.4 }}>
        Add new entry
        <IconButton
          aria-label="close"
          onClick={handleOnAddEntryClose}
          sx={{
            top: 1,
            right: 2,
            position: "absolute",
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ px: 1, display: "grid", direction: "column", gap: 2 }}>
        <SwitchMenu />
      </DialogContent>
    </Dialog>
  );
}
