import { Styles } from "jss";
import Color from 'chroma-js';
import { createAppUseStyles } from "~/styles/theme";
import { Node } from "./types";


export const useEditorStyles = createAppUseStyles(theme => ({
    root: {
        height: '99%',
        width: '99%',
        color: theme.primaryAccent,
        display: 'flex',
        flexDirection: 'row',
    },
    dag: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.secondaryAccent,
        width: '100%',
    },
    svg: {
        height: '99%',
        width: '99%',
        padding: 0,
        margin: 0,
    },
    circle: {
        fill: Color(theme.secondary).set('rgb.b', 125).hex(),
    },
    infoBox: {
        paddingLeft: '10px',
        paddingRight: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflow: 'auto',
    },
    dagEdge: {
        stroke: theme.secondaryAccent,
    },
}))

export const useNodeStyles = createAppUseStyles<{
    color: Node['color'],
    nodeHeight: number,
    nodeWidth: number,
}>(theme => {
    const edgeStyle: Styles = {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        borderRadius: '1em',
        justifyContent: 'space-around',
        alignItems: 'center',
        '&:hover': {
            backgroundColor: theme.primaryAccent,
            cursor: 'pointer',
        }
    }
    const buttonStyle: Styles = {
        fontSize: '8px',
        backgroundColor: "rgba(0,0,0,0)",
        color: theme.primaryAccent,
        borderStyle: 'none',
        height: '15px',
        width: '15px',
        cursor: 'pointer',
        transition: "500ms east-out",
    }
    return {
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            height: `100%`,
            maxHeight: `100%`,
            maxWidth: '100%',
            width: '100%',
            fontSize: 10,
        },
        inner: ({color}) => ({
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: theme.secondary,
            borderRadius: '1em',
            flex: 1,
            height: `calc(100% - 10px)`,
            maxHeight: `calc(100% - 10px)`,
            maxWidth: '100%',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            borderTopColor: color === 'red' ? Color(theme.secondary).set('rgb.r', 125).hex() :
                color === 'blue' ? Color(theme.secondary).set('rgb.b', 125).hex() :
                color === 'green' ? Color(theme.secondary).set('rgb.g', 125).hex() :
                'none'
        }),
        text: {
            flex: 4,
            display: 'flex',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            maxHeight: '100%',
        },
        buttonDelete: {
            ...buttonStyle,
            "&:hover": {
                color: theme.primary,
            }
        },
        buttonEdit: {
            ...buttonStyle,
            "&:hover": {
                transform: "rotate(45deg)"
            }
        },
        leftEdge: {
            ...edgeStyle,
            borderLeft: `1px ${theme.secondaryAccent} solid`,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
        rightEdge: {
            ...edgeStyle,
            borderRight: `1px ${theme.secondaryAccent} solid`,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
        },
    }
})