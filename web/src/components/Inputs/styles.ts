import { Styles } from "jss";
import { createAppUseStyles, AppTheme } from "~/styles/theme";

const commonInputStyle = (theme: AppTheme): Styles => ({
    input: {
        backgroundColor: theme.secondary,
        color: theme.secondaryAccent,
        borderColor: theme.primaryAccent,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        fontSize: 16,

        "&:hover": {
            backgroundColor: theme.primary,
            borderColor: theme.secondaryAccent,
        },
        "&:disabled": {
            backgroundColor: '#403f3f',
            borderColor: '#403f3f',
            color: '#403f3faa',
            cursor: 'not-allowed',
        },
    }
})

export const useInputWrapperStyles = createAppUseStyles<{
    labelSize: 'normal' | 'small',
}>(theme => {
    return {
        wrapper: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            marginTop: 10,
            marginBottom: '0.25em',
        },
        label: ({ labelSize }) => ({
            fontSize: labelSize === 'normal' ? 16 : 10,
            position: 'absolute',
            left: labelSize === 'normal' ? '0.75em': '1em',
            top: labelSize === 'normal' ? '0.5em' : '0.25em',
            fontWeight: 'bold',
            transition: 'all 200ms',
        })
    }
})

export const useInputTextStyles = createAppUseStyles<{}>(theme => ({
    ...commonInputStyle(theme),
}));

export const useInputViewEditStyles = createAppUseStyles<{
    isEditing: boolean;
}>(theme => ({
    ...commonInputStyle(theme),
    inputView: {

    },
    checkmark: {

    },
    pencil: {
        
    }
}));