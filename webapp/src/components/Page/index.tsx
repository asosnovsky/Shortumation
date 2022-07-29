import "./index.css";
import { createRef, FC, ReactNode, useEffect, useRef } from "react";
import {
  createTheme,
  Palette,
  PaletteColor,
  ThemeProvider,
  useTheme,
} from "@mui/material/styles";
import { VersionBox } from "components/VersionBox";
import { SnackbarKey, SnackbarProvider, useSnackbar } from "notistack";
import Button from "@mui/material/Button";
import { useHAConnection } from "haService/connection";
import { ConfirmProvider } from "material-ui-confirm";
import { Color } from "@mui/material";
import useWindowSize from "utils/useWindowSize";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const InternalPage: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const conn = useHAConnection();
  const theme = useTheme();
  const snackbar = useSnackbar();
  const snackbarKeyHAConKey = useRef<SnackbarKey | null>(null);
  const { isMobile } = useWindowSize();

  useEffect(() => {
    if (conn.status === "error") {
      if (snackbarKeyHAConKey.current) {
        snackbar.closeSnackbar(snackbarKeyHAConKey.current);
      }
      snackbarKeyHAConKey.current = snackbar.enqueueSnackbar(
        `Failed to connect to homeassistant due to "${JSON.stringify(
          conn.error
        )}"`,
        {
          variant: "error",
          persist: true,
        }
      );
    } else if (conn.status === "loading") {
      if (snackbarKeyHAConKey.current) {
        snackbar.closeSnackbar(snackbarKeyHAConKey.current);
      }
      snackbarKeyHAConKey.current = snackbar.enqueueSnackbar(
        `Connecting to websocket...`,
        {
          variant: "info",
        }
      );
    } else if (conn.status === "loaded") {
      if (snackbarKeyHAConKey.current) {
        snackbar.closeSnackbar(snackbarKeyHAConKey.current);
      }
      snackbarKeyHAConKey.current = snackbar.enqueueSnackbar(
        `Connected to HA!`,
        {
          variant: "success",
        }
      );
    }
  }, [conn, snackbar]);

  return (
    <main className={["page", isMobile ? "mobile" : ""].join(" ")}>
      <style>
        {`:root {
            ${convertPaletteToCss(theme.palette)}
        }`}
      </style>
      <VersionBox />
      {children}
    </main>
  );
};

export const Page: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const notistackRef = createRef<any>();
  const onClickDismiss = (key: SnackbarKey) => () => {
    notistackRef.current.closeSnackbar(key);
  };
  return (
    <ThemeProvider theme={theme}>
      <ConfirmProvider>
        <SnackbarProvider
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          ref={notistackRef}
          action={(key) => (
            <Button onClick={onClickDismiss(key)}>Dismiss</Button>
          )}
          dense
          preventDuplicate
        >
          <InternalPage>{children}</InternalPage>
        </SnackbarProvider>
      </ConfirmProvider>
    </ThemeProvider>
  );
};

export const convertPaletteToCss = (p: Palette): string => {
  let out = ``;
  for (const k of [
    "primary",
    "secondary",
    "error",
    "warning",
    "info",
    "success",
    "grey",
    "text",
    "action",
    "background",
    "common",
  ]) {
    const pc = p[k as keyof Palette] as PaletteColor | Color;
    // eslint-disable-next-line
    Object.entries(pc).forEach(([n, v]) => {
      out += `\n --mui-${k}-${n}: ${v};`;
    });
  }
  return out;
};
