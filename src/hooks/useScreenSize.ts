import { useMediaQuery, useTheme } from "@mui/material";

type ScreenSize = {
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  isUpSm: boolean;
  isUpMd: boolean;
  isUpLg: boolean;
  isUpXl: boolean;
  isDownSm: boolean;
  isDownMd: boolean;
  isDownLg: boolean;
  isDownXl: boolean;
};

export const useScreenSize = (): ScreenSize => {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));

  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));
  const isUpMd = useMediaQuery(theme.breakpoints.up("md"));
  const isUpLg = useMediaQuery(theme.breakpoints.up("lg"));
  const isUpXl = useMediaQuery(theme.breakpoints.up("xl"));

  const isDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  const isDownMd = useMediaQuery(theme.breakpoints.down("md"));
  const isDownLg = useMediaQuery(theme.breakpoints.down("lg"));
  const isDownXl = useMediaQuery(theme.breakpoints.down("xl"));

  return { isXs, isSm, isMd, isLg, isXl, isUpSm, isUpMd, isUpLg, isUpXl, isDownSm, isDownMd, isDownLg, isDownXl };
};
