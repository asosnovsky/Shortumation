import { createAppUseStyles } from "./theme";

export const usePageTheme = createAppUseStyles(theme => ({
    page: {
        // dims
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        overflow: 'auto',
        maxWidth: '100vw',
        maxHeight: '100vh',

        // font
        fontSize: '16px',
        fontFamily: 'Tahoma, Geneva, sans-serif',
        color: theme.primaryAccent,
        
        // background
        backgroundColor: theme.primary,
        
        // children
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',

        '> div': {
            flex: 1,
        },

        // scroll
        '&::-webkit-scrollbar': {
            width: '10px'
        },
        '&::-webkit-scrollbar-track': {
            background: theme.secondary,
        },
        '&::-webkit-scrollbar-thumb': {
            background: theme.secondaryAccent,
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: theme.primaryAccent,
        },
    }
}))