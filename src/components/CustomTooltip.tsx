import Tooltip, { TooltipProps } from "@mui/material/Tooltip";
import { useOptionsStore } from "@src/stores/useOptions";

export default function CustomTooltip(props: TooltipProps & { children: JSX.Element }) {
  const { title, children } = props;
  const { tooltipEnabled } = useOptionsStore();

  return (
    <Tooltip {...props} title={tooltipEnabled ? title : ""}>
      {children}
    </Tooltip>
  );
}
