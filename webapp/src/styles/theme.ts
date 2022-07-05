import "styles/root.css";

import { Classes } from "jss";
import { Context, createContext } from "react";
import { createUseStyles, Styles } from "react-jss";
import { createTheming } from "theming";

export const {
  context: ThemeContext,
  ThemeProvider,
  useTheme,
} = createTheming(
  createContext({
    primary: "var(--mui-common-black)",
    primaryLight: "var(--mui-grey-600)",
    secondary: "var(--mui-secondary-contrastText)",
    secondaryOpaque: "var(--mui-secondary-contrastText)",
    primaryAccent: "var(--mui-grey-400)",
    primaryAccentLight: "var(--mui-grey-200)",
    secondaryAccent: "var(--mui-grey-700)",
    condition: {
      primaryColor: "var(--mui-info-dark)",
      primaryAccent: "var(--mui-info-light)",
      primaryColorOpaque: "var(--condition-primary-opaque)",
    },
    green: "var(--mui-success-main)",
    greenLight: "var(--mui-success-light)",
    greenOpaque: "var(--green-opaque)",
    red: "var(--mui-error-main)",
    redAccent: "var(--mui-error-contrastText)",
    redLight: "var(--mui-error-light)",
  })
);

export type GetThemeType<C extends Context<any>> = C extends Context<infer T>
  ? T
  : unknown;
export type ClassNamesOfStyle<F extends (...args: any) => any> = Record<
  keyof ReturnType<F>,
  string
>;
export type AppTheme = GetThemeType<typeof ThemeContext>;
export const createAppUseStyles =
  <Props extends {} = {}, C extends string = string>(
    f: (theme: AppTheme) => Styles<C, Props, AppTheme>
  ) =>
  (
    props: Props
  ): {
    classes: Classes<keyof Styles<C, Props, AppTheme>>;
    theme: AppTheme;
  } => {
    const theme = useTheme();
    const useStyles = createUseStyles<C, Props, AppTheme>(f as any);
    const classes = useStyles({ ...props, theme }) as Classes<
      keyof Styles<C, Props, AppTheme>
    >;
    return { classes, theme };
  };
