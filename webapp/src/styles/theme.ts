import "styles/root.css";

import { Classes } from "jss";
import { Context, createContext } from "react"
import { createUseStyles, Styles } from "react-jss";
import { createTheming } from "theming"

export const {
    context: ThemeContext,
    ThemeProvider,
    useTheme,
} = createTheming(createContext({
    primary: '#111111',
    secondary: '#1c1c1c',
    primaryAccent: '#bbbbbb',
    secondaryAccent: '#929191',
    condition: {
        primaryColor: '#4f4f77',
    },
    red: '#ed0c0c',
    redAccent: '#9f3a3a',
}));

export type GetThemeType<C extends Context<any>> = C extends Context<infer T> ? T : unknown; 
export type ClassNamesOfStyle<F extends (...args: any) => any> = Record<keyof ReturnType<F>, string>;
export type AppTheme = GetThemeType<typeof ThemeContext>;
export const createAppUseStyles = <
    Props extends {} = {},
    C extends string = string,
>(f: (theme: AppTheme) => Styles<C, Props, AppTheme>) => (props: Props): {
    classes: Classes<keyof Styles<C, Props, AppTheme>>,
    theme: AppTheme,
} => {
    const theme = useTheme();
    const useStyles = createUseStyles<C,Props,AppTheme>(f as any)
    const classes = useStyles({...props, theme}) as Classes<keyof  Styles<C, Props, AppTheme>>;
    return {classes, theme};
}
