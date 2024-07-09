import MuiTooltip, { TooltipProps } from "@mui/material/Tooltip";
import { useOptionsStore } from "@src/stores/useOptions";

export default function Tooltip(props: TooltipProps & { children: JSX.Element }) {
  const { title, children } = props;
  const { tooltipEnabled } = useOptionsStore();

  return (
    <MuiTooltip {...props} title={tooltipEnabled ? title : ""}>
      {children}
    </MuiTooltip>
  );
}
