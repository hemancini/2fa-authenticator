import QrCode2Icon from "@mui/icons-material/QrCode2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Box } from "@mui/material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { Dispatch, ReactNode, SetStateAction } from "react";

type CardUtilsProps = {
  showQR?: boolean;
  setShowQR: Dispatch<SetStateAction<boolean>>;
  showCardUtils: boolean;
  isVisibleCode: boolean;
  setVisibleCode: Dispatch<SetStateAction<boolean>>;
};

export default function CardUtils({
  showQR,
  setShowQR,
  showCardUtils = false,
  isVisibleCode,
  setVisibleCode,
}: CardUtilsProps) {
  return (
    showCardUtils && (
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0, right: 2, position: "absolute" }}>
        <CustomIconButton onClick={() => setVisibleCode(!isVisibleCode)}>
          {isVisibleCode ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </CustomIconButton>
        <CustomIconButton onClick={() => setShowQR(!showQR)}>
          <QrCode2Icon />
        </CustomIconButton>
      </Box>
    )
  );
}

export function CustomIconButton({
  children,
  iconSize = 29,
  mr,
  ...props
}: IconButtonProps & { children: ReactNode } & { iconSize?: number } & { mr?: number }) {
  return (
    <IconButton sx={{ height: iconSize, width: iconSize, mr }} {...props}>
      {children}
    </IconButton>
  );
}
