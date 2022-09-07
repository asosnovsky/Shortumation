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
import { useHAConnection } from "services/ha/connection";
import { ConfirmProvider } from "material-ui-confirm";
import { Color, Skeleton, Theme } from "@mui/material";
import useWindowSize from "utils/useWindowSize";
import { ApiService } from "services/api/core";
import { ApiStateProvider, useMockApiService } from "services/api";
import { LangProvider, LangStore, useLang } from "services/lang";

export type PageProps = PropsWithChildren<{
  api: ApiService;
}>;

export const BareInternalPage: FC<
  PageProps & {
    isMobile: boolean;
    theme: Theme;
    lang: LangStore;
  }
> = ({ children, api, isMobile, theme, lang }) => {
  const conn = useHAConnection();
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
    } else if (conn.status === "loaded") {
      if (snackbarKeyHAConKey.current) {
        snackbar.closeSnackbar(snackbarKeyHAConKey.current);
      }
    }
  }, [conn, snackbar]);

  return (
    <ConfirmProvider
      defaultOptions={{
        cancellationText: lang.get("CLOSE"),
        confirmationText: lang.get("CONFIRM"),
      }}
    >
      <main className={["page", "column", isMobile ? "mobile" : ""].join(" ")}>
        <div className="page-contents column">{children}</div>
        <BottomBar api={api} />
        <style>
          {`:root {
      ${convertPaletteToCss(theme.palette)}
  }`}
        </style>
      </main>
    </ConfirmProvider>
  );
};

export const InternalPage: FC<PageProps> = ({ children, api }) => {
  const theme = useTheme();
  const { isMobile } = useWindowSize();
  const lang = useLang();

  if (!lang.ready) {
    return <Skeleton />;
  }

  return (
    <BareInternalPage api={api} isMobile={isMobile} theme={theme} lang={lang}>
      {children}
    </BareInternalPage>
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
      <SnackbarProvider
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        ref={notistackRef}
        action={(key) => <Button onClick={onClickDismiss(key)}>Dismiss</Button>}
        dense
        preventDuplicate
      >
        <ApiStateProvider value={props.api.state}>
          <LangProvider>
            <InternalPage {...props} />
          </LangProvider>
        </ApiStateProvider>
      </SnackbarProvider>
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
