import "./index.css";
import { FC } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { VersionBox } from "components/VersionBox";

const theme = createTheme({
    palette: {
        mode: 'dark'
    },
});


export const Page: FC = ({ children }) => {
    return <ThemeProvider theme={theme}>
        <main className="page" style={{
            color: theme.palette.text.primary,
            background: theme.palette.background.default,
        }}>
            <VersionBox />
            {children}
        </main>
    </ThemeProvider>
}