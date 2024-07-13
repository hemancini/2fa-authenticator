import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { ReactNode } from "react";

export default function IconButtonResize(
  props: IconButtonProps & { children: ReactNode } & { iconSize?: number } & {
    mr?: number;
  }
) {
  const { children, iconSize = 29, mr } = props;
  return (
    <IconButton sx={{ height: iconSize, width: iconSize, mr }} {...props}>
      {children}
    </IconButton>
  );
}
