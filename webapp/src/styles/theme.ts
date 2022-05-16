import "styles/root.css";
import "styles/page.css";

import { Classes } from "jss";
import { Context, createContext } from "react"
import { createUseStyles, Styles } from "react-jss";
import { createTheming } from "theming"

export const {
    context: ThemeContext,
    ThemeProvider,
    useTheme,
} = createTheming(createContext({
    primary: 'var(--primary)',
    primaryLight: 'var(--primary-light)',
    primaryLightOpaque: 'var(--primary-light-opaque)',
    secondary: 'var(--secondary)',
    secondaryOpaque: 'var(--secondary-opaque)',
    primaryAccent: 'var(--primary-accent)',
    primaryAccentLight: 'var(--primary-accent-light)',
    secondaryAccent: 'var(--secondary-accent)',
    condition: {
        primaryColor: 'var(--condition-primary)',
        primaryAccent: 'var(--condition-accent)',
        primaryColorOpaque: 'var(--condition-primary-opaque)'
    },
    green: 'var(--green)',
    greenLight: 'var(--green-light)',
    greenOpaque: 'var(--green-opaque)',
    red: 'var(--error)',
    redOpaque: 'var(--error-opaque)',
    redAccent: 'var(--error-accent)',
    redLight: 'var(--error-light)',
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
        const useStyles = createUseStyles<C, Props, AppTheme>(f as any)
        const classes = useStyles({ ...props, theme }) as Classes<keyof Styles<C, Props, AppTheme>>;
        return { classes, theme };
    }
