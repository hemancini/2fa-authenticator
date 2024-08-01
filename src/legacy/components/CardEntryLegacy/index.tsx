import { CounterProgress } from "@components/CardEntry/Countdown";
import CustomIconButton from "@components/CustomIconButton";
import Tooltip from "@components/CustomTooltip";
import ShowQR from "@components/dialogs/ShowQR";
import PersonIcon from "@mui/icons-material/Person";
import PushPinIcon from "@mui/icons-material/PushPin";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Card, CardActionArea, CardContent, Fade, Theme, Tooltip as MuiTooltip, Typography } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { red } from "@mui/material/colors";
import { t } from "@src/chrome/i18n";
import { sendMessageToBackground } from "@src/chrome/message";
import { DEFAULT_COLORS } from "@src/config";
import { OTPEntry } from "@src/entry/type";
import AccountBypassLegacy from "@src/legacy/components/dialogs/AccountBypassLegacy";
import EntriesContext from "@src/legacy/contexts/Entries";
import useCounter from "@src/legacy/hooks/useCounter";
import { OTPEntry as OTPEntryLegacy } from "@src/legacy/models/otp";
import { useOptionsStore } from "@src/stores/useOptions";
import { ReactNode, useContext, useEffect, useMemo, useState } from "react";

type EntryContentProps = {
  entry: OTPEntryLegacy;
  handleCopyCode: () => void;
  isToolpipCopyOpen: boolean;
  isVisibleCode?: boolean;
};

const issuerBypass = "WOM";
const regexEAS = /^[A-Za-z0-9+/=]+$/;
const defaultEyesIconSize = 20;

export default function CardEntryLegacy({ entry }: { entry: OTPEntryLegacy }) {
  const { bypassEnabled, isVisibleTokens } = useOptionsStore();
  const [isVisible, setVisible] = useState(isVisibleTokens);

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
    setVisible(isVisibleTokens);
  }, [isVisibleTokens]);

  return (
    <>
      <Card
        variant="outlined"
        component="section"
        onMouseOver={() => setShowOptions(true)}
        onMouseOut={() => setShowOptions(false)}
        sx={{
          position: "relative",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.03)",
          },
        }}
      // {...{
      //   sx: { borderRadius: 0 },
      //   variant: "elevation",
      // }}
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
                      <CustomIconButton
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
                      </CustomIconButton>
                    </Box>
                  ),
                [entry, showAccount, showOptions, isValidData, bypassEnabled]
              )}
              <Box display={showOptions ? "block" : "none"}>
                <CustomIconButton onClick={() => setVisible(!isVisible)} style={{ display: "none" }}>
                  <Tooltip title={t("showToken")} disableInteractive>
                    {isVisible ? (
                      <VisibilityIcon sx={{ fontSize: defaultEyesIconSize }} />
                    ) : (
                      <VisibilityOffIcon sx={{ fontSize: defaultEyesIconSize }} />
                    )}
                  </Tooltip>
                </CustomIconButton>
                <CustomIconButton onClick={() => setShowQR(!showQR)}>
                  <Tooltip title={t("showQR")} disableInteractive>
                    <QrCode2Icon />
                  </Tooltip>
                </CustomIconButton>
              </Box>
              <Box display={showOptions || entry.pinned ? "block" : "none"}>
                <CustomIconButton
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
                </CustomIconButton>
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
      <ShowQR entry={entry as unknown as OTPEntry} open={showQR} setOpen={setShowQR} />
      <AccountBypassLegacy
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
  const isDark = (theme: Theme) =>
    Object.values(DEFAULT_COLORS).find((c) => c.main === themeColor)?.dark && theme.palette.mode === "dark";

  return (
    <>
      <Box aria-label="otp-code" display="flex" sx={{ minHeight: 31 }}>
        <CardActionArea onClick={handleCopyCode} sx={{ borderRadius: 2 }}>
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
                fontSize: isVisibleCode ? "1.9rem" : "3rem",
                letterSpacing: 4,
                lineHeight: isVisibleCode ? 1 : 0.6,
              }}
            >
              {isVisibleCode ? entry.code : "••••••"}
            </Typography>
          </MuiTooltip>
        </CardActionArea>
        <Box sx={{ minWidth: "100%" }} />
      </Box>
      <BoxRelative>
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

const BoxRelative = (props: BoxProps & { children: ReactNode }) => {
  const { children } = props;
  return (
    <Box py={0.2} pl={0.2} display="flex" position="relative" {...props}>
      {children}
    </Box>
  );
};
