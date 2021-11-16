import { Styles } from "jss";
import Color from 'chroma-js';
import { createAppUseStyles } from "~/styles/theme";

export const useStyles = createAppUseStyles<{
    hasChildren: boolean
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
        root: ({ hasChildren }) => ({
            background: theme.primary,
            padding: 0,
            position: 'relative',
            display: 'flex',
            flexDirection: hasChildren? 'column' : 'row',
            width: hasChildren? '100%' : undefined,
            height: hasChildren? '100%' : undefined,
        }),
        title: {
            background: theme.condition.primaryColor,
            border: `1px solid ${theme.primaryAccent}`,
            borderRadius: 10,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            padding: 10,
            maxWidth: 80,
            textOverflow: 'ellipsis',
        },
        deleteBtnRoot: {
            ...deleteBtn,
            position: 'absolute',
            left: -35,
            top: 10,
        },
        modifyBtn: {
            backgroundColor: theme.primary,
            fill: theme.primaryAccent,
            border: `1px solid ${theme.primaryAccent}`,
            borderRadius: 10,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            cursor: 'pointer',
            "&:hover": {
                backgroundColor: Color(theme.primary).brighten().hex(),
                fill: Color(theme.primaryAccent).brighten().hex(),
            },
            "&:hover $icon": {
                transform: "rotate(90deg)"
            }
        },
        icon: {
            transition: "200ms ease-out"
        },
        deleteBtn,
        children: ({}) => ({
            flex: 1,
            paddingLeft: 10,
            paddingRight: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: `1px solid ${theme.primaryAccent}`,
            // borderRadius: 10,
            // borderTopLeftRadius: 0,
            // borderBottomLeftRadius: 0,
        })
    }
})