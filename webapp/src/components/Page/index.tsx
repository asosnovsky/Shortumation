import "./index.css";
import { createRef, FC, PropsWithChildren, useEffect, useRef } from "react";
import {
  createTheme,
  Palette,
  PaletteColor,
  ThemeProvider,
  useTheme,
} from "@mui/material/styles";
import { BottomBar } from "components/BottomBar";
import { SnackbarKey, SnackbarProvider, useSnackbar } from "notistack";
import Button from "@mui/material/Button";
import { useHAConnection } from "haService/connection";
import { ConfirmProvider } from "material-ui-confirm";
import { Color } from "@mui/material";
import useWindowSize from "utils/useWindowSize";
import { ApiService } from "apiService/core";
import { ApiStateProvider, useMockApiService } from "apiService";

export type PageProps = PropsWithChildren<{
  api: ApiService;
}>;

export const InternalPage: FC<PageProps> = ({ children, api }) => {
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
    }
  }, [conn, snackbar]);

  return (
    <main className={["page", "column", isMobile ? "mobile" : ""].join(" ")}>
      <div className="page-contents column">{children}</div>
      <BottomBar api={api} />
      <style>
        {`:root {
            ${convertPaletteToCss(theme.palette)}
        }`}
      </style>
    </main>
  );
};

export const Page: FC<PageProps> = (props) => {
  const notistackRef = createRef<any>();
  const onClickDismiss = (key: SnackbarKey) => () => {
    notistackRef.current.closeSnackbar(key);
  };
  const theme = createTheme({
    palette: {
      mode: props.api.state.theme,
    },
  });

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
          <ApiStateProvider value={props.api.state}>
            <InternalPage {...props} />
          </ApiStateProvider>
        </SnackbarProvider>
      </ConfirmProvider>
    </ThemeProvider>
  );
};

export const MockPage: FC<PropsWithChildren<{}>> = (props) => {
  const api = useMockApiService([]);
  return <Page api={api} {...props} />;
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
