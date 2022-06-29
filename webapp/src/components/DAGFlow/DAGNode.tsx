import "./DAGNode.css";
import "./DAGNode.flipped.css";

import { NodeColor } from "types/graphs";
import { Handle, Position } from "react-flow-renderer";
import { FC, ReactNode } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createToNodeMakerFunction } from "./helpers";
import { SpeedDial } from "components/SpeedDial";
import Edit from "@mui/icons-material/Edit";
import { useTheme } from "@mui/material";

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
}
export interface DAGNodeProps extends DAGNodeDataProps {
  height: number;
  width: number;
  flipped: boolean;
}

export const makeConditionPoint = createToNodeMakerFunction<
  {
    label: ReactNode;
    onEditClick: () => void;
  },
  DAGNodeProps
>((pre, { conditionWidth, conditionHeight, flipped }) => ({
  color: "lblue",
  label: pre.label,
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
  flipped,
}) => {
  const theme = useTheme();
  return (
    <>
      <div
        className={["dagnode", flipped ? "flipped" : ""].join(" ")}
        style={{
          height,
          width,
        }}
      >
        <div
          className="dagnode--inner"
          style={{
            maxHeight: height,
            maxWidth: width,
            minWidth: Math.max(width / 2, height / 2),
            borderBottomColor: theme.palette.grey[500],
            borderLeftColor: theme.palette.grey[700],
            borderRightColor: theme.palette.grey[700],
            borderTopColor:
              color === "blue"
                ? theme.palette.info.main
                : color === "green"
                ? theme.palette.success.light
                : color === "lblue"
                ? theme.palette.info.light
                : color === "red"
                ? theme.palette.error.dark
                : "none",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <SpeedDial
            icon={<SettingsOutlinedIcon className="dagnode--actions-btn" />}
          >
            <IconButton onClick={onEditClick} size="small">
              <Edit color="success" fontSize="inherit" />
            </IconButton>
            <IconButton onClick={onXClick} size="small">
              <DeleteForeverIcon fontSize="inherit" color="error" />
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
          </SpeedDial>

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
          <div className="dagnode--label">{label}</div>
        </div>
      </div>
    </>
  );
};
