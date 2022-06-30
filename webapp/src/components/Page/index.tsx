import "./index.css";
import { createRef, FC, ReactNode, useEffect, useRef } from "react";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { VersionBox } from "components/VersionBox";
import { SnackbarKey, SnackbarProvider, useSnackbar } from "notistack";
import Button from "@mui/material/Button";
import { useHAConnection } from "haService/connection";
import { ConfirmProvider } from "material-ui-confirm";

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
    <main
      className="page"
      style={{
        color: theme.palette.text.primary,
        background: theme.palette.background.default,
      }}
    >
      {/* <style>
        {`:root {
            --primary: ${theme.palette.primary.main};
            --secondary: ${theme.palette.secondary.main};
            --secondary: ${theme.palette..main};
            --primary-accent: #bbb;
            --primary-accent-light: #eee;
            --secondary-accent: #929191;
            --green: #1f1;
            --green-opaque: #1f15;
            --green-light: #6f5;
            --error: #c55;
            --error-light: #f77;
            --error-dark: #5c2323;
            --error-opaque: #c555;
            --error-accent: #9f3a3a;
            --change: #0f9;
            --condition-primary: #447;
            --condition-accent: #8af;
            --condition-primary-opaque: #4476;
            touch-action: pan-x pan-y;
            height: 100%;
        }`}
      </style> */}
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
