import SwitchMui, { SwitchProps } from "@mui/material/Switch";
import { useScreenSize } from "@src/hooks/useScreenSize";

export default function CustomSwitch(props: SwitchProps) {
  const { isUpSm } = useScreenSize();

  const stylesDownSm = {
    "& .MuiSwitch-track": { width: 25, height: "75%" },
    "& .MuiSwitch-thumb": { width: 16, height: 16 },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(15px)",
    },
  };

  return <SwitchMui sx={!isUpSm ? stylesDownSm : {}} {...props} />;
}
