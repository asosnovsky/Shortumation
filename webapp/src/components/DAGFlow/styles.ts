import { Styles } from "jss";
import { createAppUseStyles } from "styles/theme";
import { NodeColor } from "types/graphs";

export const useNodeStyles = createAppUseStyles<{
  color: NodeColor;
  nodeHeight: number;
  nodeWidth: number;
  accentBackground: boolean;
}>((theme) => {
  const edgeStyle: Styles = {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    borderRadius: "1em",
    justifyContent: "space-around",
    alignItems: "center",
    "&:hover": {
      backgroundColor: theme.primaryAccent,
      cursor: "pointer",
    },
  };
  const buttonStyle: Styles = {
    fontSize: "8px",
    backgroundColor: "rgba(0,0,0,0)",
    color: theme.primaryAccent,
    borderStyle: "none",
    height: "15px",
    width: "15px",
    cursor: "pointer",
  };
  return {
    speeddial: {
      height: "2em",
      width: "2em",
    },
    root: ({ nodeHeight, nodeWidth }) => ({
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      height: nodeHeight,
      maxHeight: nodeHeight,
      maxWidth: nodeWidth,
      width: nodeWidth,
      fontSize: 10,
    }),
    inner: ({ color, accentBackground }) => ({
      position: "relative",
      display: "flex",
      flexDirection: "row",
      backgroundColor: !accentBackground
        ? theme.secondary
        : color === "lblue"
        ? theme.condition.primaryColorOpaque
        : "none",
      borderRadius: "1em",
      flex: 1,
      height: `100%`,
      maxHeight: `100%`,
      maxWidth: "100%",
      marginTop: "2.5px",
      marginBottom: "2.5px",
      borderTopWidth: "1px",
      borderTopStyle: "solid",
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
      borderTopColor:
        color === "red"
          ? theme.redAccent
          : color === "blue"
          ? theme.condition.primaryColor
          : color === "green"
          ? theme.green
          : color === "lblue"
          ? theme.condition.primaryAccent
          : "none",
    }),
    textWrap: {
      display: "flex",
      flex: 4,
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      maxHeight: "100%",
      maxWidth: "50%",
    },
    text: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "break-spaces",
      lineBreak: "anywhere",
      cursor: "default",
    },
    buttonDelete: {
      ...buttonStyle,
      "&:hover": {
        color: theme.primary,
      },
    },
    buttonEdit: {
      ...buttonStyle,
      "&:hover": {
        transform: "rotate(45deg)",
      },
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
  };
});

export const useCircleStyles = createAppUseStyles<{
  size: number;
  hasOnFunction: boolean;
  hasRemoveFunction: boolean;
  backgroundColor?: string;
}>((theme) => ({
  root: ({ size, hasOnFunction, hasRemoveFunction, backgroundColor }) => {
    const baseColor = backgroundColor ? backgroundColor : theme.green;
    const hoverColor = hasOnFunction ? theme.greenOpaque : baseColor;
    return {
      backgroundColor: baseColor,
      borderRadius: hasRemoveFunction ? 10 : 500,
      height: size,
      width: size,
      color: theme.primary,
      cursor: hasOnFunction ? "pointer" : "default",
      "&:hover": {
        backgroundColor: hoverColor,
      },
      fontSize: `${size * 0.4}px`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
  },
  trashIcon: {
    padding: 1,
  },
}));
