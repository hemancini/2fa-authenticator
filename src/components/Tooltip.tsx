import MuiTooltip, { TooltipProps } from "@mui/material/Tooltip";
import OptionsContext from "@src/contexts/Options";
import { ReactNode, useContext } from "react";

export default function Tooltip(props: TooltipProps & { children: ReactNode }) {
  const { title, children } = props;
  const { tooltipEnabled } = useContext(OptionsContext);

  return (
    <MuiTooltip {...props} title={tooltipEnabled ? title : ""}>
      {children}
    </MuiTooltip>
  );
}
