import { useTheme } from "@mui/material/styles";
import SwitchMui, { SwitchProps } from "@mui/material/Switch";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function CustomSwitch(props: SwitchProps) {
  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));

  const stylesDownSm = {
    "& .MuiSwitch-track": { width: 25, height: "75%" },
    "& .MuiSwitch-thumb": { width: 16, height: 16 },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(15px)",
    },
  };

  return <SwitchMui sx={!isUpSm ? stylesDownSm : {}} {...props} />;
}
