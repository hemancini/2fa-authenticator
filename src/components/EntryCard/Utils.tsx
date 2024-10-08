import Tooltip from "@components/CustomTooltip";
import { AccountBypassButton } from "@components/dialogs/AccountBypass";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Box } from "@mui/material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { t } from "@src/chrome/i18n";
import { useEntries } from "@src/stores/useEntries";
import { Dispatch, ReactNode, SetStateAction } from "react";

type CardUtilsProps = {
  entry: OTPEntry;
  showQR?: boolean;
  setShowQR: Dispatch<SetStateAction<boolean>>;
  showCardUtils: boolean;
};

export default function CardUtils({ entry, showQR, setShowQR, showCardUtils = false }: CardUtilsProps) {
  const { hash, isVisible } = entry;
  const { toggleVisible } = useEntries();
  return (
    showCardUtils && (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 0.2,
          right: 4,
          position: "absolute",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        <AccountBypassButton entry={entry} />
        <CustomIconButton title={t("showToken")} onClick={() => toggleVisible(hash)}>
          {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </CustomIconButton>
        <CustomIconButton title={t("showQR")} onClick={() => setShowQR(!showQR)}>
          <QrCode2Icon />
        </CustomIconButton>
      </Box>
    )
  );
}

export function CustomIconButton({
  children,
  iconSize = 29,
  title = "",
  disableInteractive = true,
  ...props
}: IconButtonProps & { children: ReactNode } & { iconSize?: number } & { title: string } & {
  disableInteractive?: boolean;
}) {
  return (
    <Tooltip title={title} disableInteractive={disableInteractive}>
      <IconButton sx={{ height: iconSize, width: iconSize }} {...props}>
        {children}
      </IconButton>
    </Tooltip>
  );
}
