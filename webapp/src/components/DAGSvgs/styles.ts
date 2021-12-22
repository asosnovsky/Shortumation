import { Styles } from "jss";
import Color from 'chroma-js';
import { createAppUseStyles } from "styles/theme";
import { Node } from "types/graphs";


export const useBoardStyles = createAppUseStyles<{
  boardHeight: number,
  boardWidth: number,
}>(theme => ({
  dag: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.secondaryAccent,
    color: theme.primaryAccent,
    background: theme.primary,
    width: '100%',
    height: '100%',
    overflow: 'scroll'
  },
  svg: ({boardHeight, boardWidth}) => ({
    minHeight: `${boardHeight}px`,
    minWidth: `${boardWidth}px`,
    padding: 0,
    margin: 0,
  }),
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
    inner: ({ color }) => ({
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: theme.secondary,
      borderRadius: '1em',
      flex: 1,
      height: `100%`,
      maxHeight: `100%`,
      maxWidth: '100%',
      marginTop: '2.5px',
      marginBottom: '2.5px',
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
      borderTopColor: color === 'red' ? Color(theme.secondary).set('rgb.r', 125).hex() :
        color === 'blue' ? Color(theme.secondary).set('rgb.b', 125).hex() :
          color === 'green' ? Color(theme.secondary).set('rgb.g', 125).hex() :
            'none'
    }),
    textWrap: {
      display: 'flex',
      flex: 4,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      maxHeight: '100%',
      maxWidth: "50%",
    },
    text: {
      textOverflow: 'ellipsis',
      overflow: "hidden",
      whiteSpace: "nowrap",
      cursor: 'default',
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
      borderLef: `1px ${theme.secondaryAccent} solid`,
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

export const useCircleStyles = createAppUseStyles<{ 
  size: number,
  hasOnFunction: boolean,
  hasRemoveFunction: boolean,
  backgroundColor?: string,
 }>(theme => ({
   root: ({ size, hasOnFunction, hasRemoveFunction, backgroundColor }) => {
     const baseColor = backgroundColor ? backgroundColor : Color(theme.primary).set('rgb.g', 100).hex();
     const hoverColor = (hasOnFunction && !hasRemoveFunction) ? Color(theme.primary).set('rgb.g', 150).hex() : baseColor
     return {
      backgroundColor: baseColor,
      borderRadius: hasRemoveFunction ? 10 : 500,
      height: size,
      width: size,
      cursor: hasOnFunction ? "pointer" : 'default',
      "&:hover": {
        backgroundColor: hoverColor,
      },
      fontSize: `${size * 0.4}px`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }
  },
  icon: {
    "&:hover": {
      borderRadius: 500,
      background: Color(theme.primary).set('rgb.g', 150).hex(),
    }
  },
  trashIcon: {
    padding: 1,
    "&:hover": {
      borderRadius: 500,
      background: Color(theme.primary).set('rgb.g', 150).hex(),
      cursor: 'pointer',
    }
  }
}))
