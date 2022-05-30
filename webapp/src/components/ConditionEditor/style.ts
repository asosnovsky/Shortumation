import { Styles } from "jss";
import { createAppUseStyles } from "styles/theme";

export const useStyles = createAppUseStyles<{
    hasChildren: boolean,
    isMobile: boolean,
}>(theme => {
    const deleteBtn: Styles = {
        borderRadius: '10px',
        borderStyle: 'none',
        padding: '0',
        margin: '0',
        background: theme.red,
        width: '30px',
        height: '15px',
        fontSize: '10px',
        textAlign: 'center',
        cursor: 'pointer',
        "&:hover": {
            background: theme.redAccent,
        }
    }
    return {
        root: ({ hasChildren, isMobile }) => ({
            background: theme.primary,
            padding: 0,
            position: 'relative',
            display: 'flex',
            flexDirection: isMobile ? 'column' : hasChildren ? 'column' : 'row',
        }),
        title: ({ hasChildren }) => ({
            display: 'flex',
            border: hasChildren ? `1px solid ${theme.primaryAccent}` : 'none',
            borderRadius: 10,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            height: '100%',
        }),
        titleText: ({ hasChildren }) => ({
            background: theme.condition.primaryColor,
            border: `1px solid ${theme.primaryAccent}`,
            borderRadius: 10,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: hasChildren ? 0 : 10,
            minWidth: '10em',
            maxWidth: '30em',
            textOverflow: 'ellipsis',
            textAlign: 'center',
            cursor: 'pointer',
            color: theme.primaryAccent,
        }),
        deleteBtnRoot: {
            ...deleteBtn,
            position: 'absolute',
            left: -35,
            top: 10,
        },
        modifyBtn: ({ hasChildren }) => ({
            // styling
            backgroundColor: theme.green,
            color: theme.primary,
            fill: theme.primaryAccent,
            borderColor: theme.primaryAccent,
            borderWidth: 1,
            borderRadius: hasChildren ? 10 : 0,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            cursor: 'pointer',

            // positioning
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0px 10px',
            right: 1,
            top: 10,

            // on hover
            "&:hover": {
                backgroundColor: theme.greenLight,
                fill: theme.primaryAccentLight,
            },
            "&:hover $icon": {
                transform: "rotate(90deg)"
            }
        }),
        icon: {},
        deleteBtn,
        conditionWrap: {
            overflow: 'auto',
        },
        children: ({ hasChildren }) => ({
            flex: 1,
            paddingLeft: hasChildren ? 50 : 10,
            paddingRight: hasChildren ? 0 : 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            border: `1px solid ${theme.secondaryAccent}`,
            borderBottomRightRadius: hasChildren ? 10 : 0,
            borderBottomLeftRadius: hasChildren ? 10 : 0,
            minHeight: hasChildren ? undefined : '100%',
            overflow: 'scroll'
        }),
        addBtnContainer: {
            display: 'flex',
            justifyContent: 'center',
        },
        yamlBtn: {
            backgroundColor: theme.secondary,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.secondaryAccent,
            color: theme.secondaryAccent,
            paddingLeft: 20,
            paddingRight: 20,
            cursor: 'pointer',
            "&:hover": {
                backgroundColor: theme.primaryLight,
                fill: theme.primaryAccentLight,
            },
        },
        addBtn: {
            backgroundColor: theme.secondary,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.secondaryAccent,
            color: theme.secondaryAccent,
            borderRadius: 5,
            marginTop: 5,
            marginBottom: 5,
            paddingLeft: 20,
            paddingRight: 20,
            cursor: 'pointer',
            "&:hover": {
                backgroundColor: theme.primaryLight,
                fill: theme.primaryAccentLight,
            },
        }
    }
})
