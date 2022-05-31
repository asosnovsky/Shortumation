import "./index.css";
import { FC, ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { VersionBox } from "components/VersionBox";
import { SnackbarProvider } from 'notistack';

const theme = createTheme({
    palette: {
        mode: 'dark'
    },
});


export const Page: FC<{
    children: ReactNode
}> = ({ children }) => {
    return <ThemeProvider theme={theme}>
        <SnackbarProvider>
            <main className="page" style={{
                color: theme.palette.text.primary,
                background: theme.palette.background.default,
            }}>
                <VersionBox />
                {children}
            </main>
        </SnackbarProvider>
    </ThemeProvider>
}