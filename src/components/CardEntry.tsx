import CounterProgress from "@components/CounterProgress";
import DialogQR from "@components/DialogQR";
import EditAccount from "@components/EditAccount";
import IconButtonResize from "@components/IconButtonResize";
import PersonIcon from "@mui/icons-material/Person";
import PushPinIcon from "@mui/icons-material/PushPin";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Card, CardActionArea, CardContent, Theme } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { red } from "@mui/material/colors";
import Fade from "@mui/material/Fade";
import MuiTooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { t } from "@src/chrome/i18n";
import { sendMessageToBackground } from "@src/chrome/message";
import EntriesContext from "@src/contexts/Entries";
import useCounter from "@src/hooks/useCounter";
import { OTPEntry } from "@src/models/otp";
import { useOptionsStore } from "@src/stores/useOptionsStore";
import { ReactNode, useContext, useEffect, useMemo, useState } from "react";

import Tooltip from "./Tooltip";

type EntryContentProps = {
  entry: OTPEntry;
  handleCopyCode: () => void;
  isToolpipCopyOpen: boolean;
  isVisibleCode?: boolean;
};

const issuerBypass = "WOM";
const regexEAS = /^[A-Za-z0-9+/=]+$/;
const defaultEyesIconSize = 20;

const BoxRelative = (props: BoxProps & { children: ReactNode }) => {
  const { children } = props;
  return (
    <Box py={0.2} pl={0.2} display="flex" position="relative" {...props}>
      {children}
    </Box>
  );
};

export default function CardEntry({ entry }: { entry: OTPEntry }) {
  const { bypassEnabled, isVisibleCodes } = useOptionsStore();
  const [isVisible, setVisible] = useState(isVisibleCodes);

  const { handleEntriesUpdate } = useContext(EntriesContext);

  const [showQR, setShowQR] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const [showAccount, setShowAccount] = useState(false);
  const [isToolpipCopyOpen, setToolpipCopyOpen] = useState(false);

  const isValidData = regexEAS.test(entry?.user) && regexEAS.test(entry?.pass);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(entry?.code).then(() => {
      setToolpipCopyOpen(true);
      setTimeout(() => setToolpipCopyOpen(false), 1000);
      handleAutoFill();
    });
  };

  const handleAutoFill = () => {
    const { code } = entry;
    if (code) {
      return new Promise((resolve, reject) => {
        sendMessageToBackground({
          message: { type: "autofill", data: { code } },
        });
      });
    }
  };

  useEffect(() => {
    setVisible(isVisibleCodes);
  }, [isVisibleCodes]);

  return (
    <>
      <Card
        variant="outlined"
        onMouseOver={() => setShowOptions(true)}
        onMouseOut={() => setShowOptions(false)}
        sx={{ my: 1.7 }}
      >
        <CardContent sx={{ py: 0.3, px: 1.2, "&:last-child": { pb: 0.3 } }}>
          <BoxRelative>
            <Box aria-label="issuer" mt={0.3} maxWidth="80%">
              <Typography noWrap sx={{ fontSize: 14 }} color="text.secondary">
                {entry.issuer || <span>&nbsp;</span>}
              </Typography>
            </Box>
            <Box position="absolute" right={-7} display="flex">
              {useMemo(
                () =>
                  bypassEnabled === true &&
                  entry.issuer === issuerBypass && (
                    <Box display={showOptions || isValidData ? "block" : "none"}>
                      <IconButtonResize
                        onClick={() => setShowAccount(!showAccount)}
                        mr={!showOptions && isValidData ? 0 : 0.3}
                      >
                        <Tooltip title={t("user")} disableInteractive>
                          <PersonIcon
                            sx={{
                              fontSize: !showOptions && isValidData && 16,
                              color: (theme) => !showOptions && isValidData && theme.palette.text.disabled,
                            }}
                          />
                        </Tooltip>
                      </IconButtonResize>
                    </Box>
                  ),
                [entry, showAccount, showOptions, isValidData, bypassEnabled]
              )}
              <Box display={showOptions ? "block" : "none"}>
                <IconButtonResize onClick={() => setVisible(!isVisible)} style={{ display: "none" }}>
                  <Tooltip title={t("showToken")} disableInteractive>
                    {isVisible ? (
                      <VisibilityIcon sx={{ fontSize: defaultEyesIconSize }} />
                    ) : (
                      <VisibilityOffIcon sx={{ fontSize: defaultEyesIconSize }} />
                    )}
                  </Tooltip>
                </IconButtonResize>
                <IconButtonResize onClick={() => setShowQR(!showQR)}>
                  <Tooltip title={t("showQR")} disableInteractive>
                    <QrCode2Icon />
                  </Tooltip>
                </IconButtonResize>
              </Box>
              <Box display={showOptions || entry.pinned ? "block" : "none"}>
                <IconButtonResize
                  onClick={async () => {
                    entry.index = !entry.pinned ? -1 : entry.index;
                    entry.pinned = !entry.pinned;
                    await entry.update();
                    await handleEntriesUpdate();
                  }}
                >
                  <Tooltip title={t("pin")} disableInteractive>
                    <PushPinIcon
                      sx={{
                        fontSize: !showOptions && entry.pinned && 16,
                        transform: !entry.pinned && "rotate(40deg)",
                        color: (theme) => entry.pinned && !showOptions && theme.palette.text.disabled,
                      }}
                    />
                  </Tooltip>
                </IconButtonResize>
              </Box>
            </Box>
          </BoxRelative>
          <EntryContent
            entry={entry}
            isVisibleCode={isVisible}
            handleCopyCode={handleCopyCode}
            isToolpipCopyOpen={isToolpipCopyOpen}
          />
        </CardContent>
      </Card>
      <DialogQR entry={entry} open={showQR} setOpen={setShowQR} />
      <EditAccount
        entry={entry}
        isOpen={showAccount}
        setOpen={setShowAccount}
        handleEntriesUpdate={handleEntriesUpdate}
      />
    </>
  );
}

const EntryContent = (props: EntryContentProps) => {
  const { entry, handleCopyCode, isToolpipCopyOpen, isVisibleCode } = props;
  const { themeColor } = useOptionsStore((state) => ({
    themeColor: state.themeColor,
  }));

  const period = entry?.period || 30;
  const { discount, progress } = useCounter({ period });
  const isDark = (theme: Theme) => DEFAULT_COLORS[0].hex === themeColor && theme.palette.mode !== "dark";

  return (
    <>
      <Box aria-label="otp-code" display="flex">
        <CardActionArea onClick={handleCopyCode}>
          <MuiTooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            open={isToolpipCopyOpen}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={t("copied")}
            disableInteractive
            placement="right"
            arrow
          >
            <Typography
              className={discount <= 4 ? "parpadea" : ""}
              sx={{
                color:
                  discount <= 4
                    ? red[400]
                    : (theme) => (isDark(theme) ? theme.palette.primary.contrastText : theme.palette.primary.main),
                fontWeight: "bold",
                fontSize: "1.9rem",
                letterSpacing: isVisibleCode ? 4 : 12,
                lineHeight: 1,
                pl: !isVisibleCode && 0.5,
              }}
            >
              {isVisibleCode ? entry.code : "••••••"}
            </Typography>
          </MuiTooltip>
        </CardActionArea>
        <Box sx={{ minWidth: "100%" }} />
      </Box>
      <BoxRelative mb={0.3}>
        <Box aria-label="account" display="flex" maxWidth="80%">
          <Typography noWrap sx={{ fontSize: 14 }} color="text.secondary">
            {entry.account || <span>&nbsp;</span>}
          </Typography>
        </Box>
        <Box display="flex" position="absolute" bottom={5} right={0}>
          <CounterProgress
            size={25}
            count={discount}
            value={progress}
            sx={{
              "& .MuiCircularProgress-circle": {
                transition: `stroke-dashoffset ${period - discount >= 1 ? 1 : 0.4}s ease-in-out`,
              },
              color: discount <= 5 && red[400],
              scale: "-1 1",
            }}
          />
        </Box>
      </BoxRelative>
    </>
  );
};
