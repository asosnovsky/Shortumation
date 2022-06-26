import "./DAGNode.css";
import { PencilIcon } from "components/Icons";
import { NodeColor } from "types/graphs";
import { useNodeStyles } from "./styles";
import { Handle, Position } from "react-flow-renderer";
import { FC, ReactNode, useState } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createToNodeMakerFunction } from "./helpers";

export type DAGNodeOnMove<Direction extends string> = Record<
  Direction,
  () => void
>;
export type DAGNodeOnMoveEvents = Partial<
  DAGNodeOnMove<"up" | "down" | "left" | "right">
>;
export interface DAGNodeDataProps {
  onXClick?: () => void;
  onEditClick?: () => void;
  onMove?: DAGNodeOnMoveEvents;
  color: NodeColor;
  label: ReactNode;
  hasInput?: boolean;
  accentBackground?: boolean;
}
export interface DAGNodeProps extends DAGNodeDataProps {
  height: number;
  width: number;
  flipped: boolean;
}

export const makeConditionPoint = createToNodeMakerFunction<
  {
    totalConditions: number;
    onEditClick: () => void;
  },
  DAGNodeProps
>((pre, { conditionWidth, conditionHeight, flipped }) => ({
  color: "lblue",
  accentBackground: true,
  label: `${pre.totalConditions} Condition${
    pre.totalConditions !== 1 ? "s" : ""
  }`,
  height: conditionHeight,
  width: conditionWidth,
  hasInput: true,
  onEditClick: pre.onEditClick,
  flipped,
}));

export const makeActionPoint = createToNodeMakerFunction<
  DAGNodeDataProps,
  DAGNodeProps
>((pre, { nodeHeight, nodeWidth, flipped }) => ({
  ...pre,
  height: nodeHeight,
  width: nodeWidth,
  flipped,
}));

export const DAGNode: FC<DAGNodeProps> = ({
  label,
  height,
  width,
  onXClick,
  onEditClick = () => {},
  onMove = {},
  color,
  hasInput = false,
  accentBackground = false,
  flipped,
}) => {
  const { classes, theme } = useNodeStyles({
    color,
    nodeHeight: height,
    nodeWidth: width,
    accentBackground,
  });
  const [open, setOpen] = useState(false);
  return (
    <>
      {hasInput && (
        <Handle
          type="target"
          position={flipped ? Position.Top : Position.Left}
        />
      )}
      <Handle
        type="source"
        position={flipped ? Position.Bottom : Position.Right}
      />
      <div className={classes.root}>
        <div className={classes.inner}>
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div
              className={classes.leftEdge}
              onClick={() => setOpen(!open)}
              onMouseEnter={() => setOpen(true)}
            >
              <SettingsOutlinedIcon className="dagnode--actions" />
              <div
                className={[
                  "dagnode--actions--list",
                  open ? "open" : "close",
                ].join(" ")}
              >
                <IconButton onClick={onXClick} size="small">
                  <DeleteForeverIcon fontSize="inherit" color="warning" />
                </IconButton>
                <IconButton onClick={onEditClick} size="small">
                  <PencilIcon color={theme.green} size={0.8} />
                </IconButton>
                {Object.entries(onMove).map(([key, action]) => (
                  <IconButton
                    key={key}
                    onClick={action}
                    size="small"
                    className={["dagnode--actions--move", key].join(" ")}
                  >
                    <ArrowBackIcon fontSize="inherit" />
                  </IconButton>
                ))}
              </div>
            </div>
          </ClickAwayListener>
          <div className={classes.textWrap}>
            <span className={classes.text}>{label}</span>
          </div>
          <div className={classes.rightEdge} onClick={onEditClick}></div>
        </div>
      </div>
    </>
  );
};
