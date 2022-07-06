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
import InputBoolean from "components/Inputs/InputBoolean";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import Add from "@mui/icons-material/Add";

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
  onSetEnabled?: () => void;
  onAddNode?: () => void;
  onMove?: DAGNodeOnMoveEvents;
  color: NodeColor;
  label: ReactNode;
  hasInput?: boolean;
  enabled: boolean;
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
    onAddNode: () => void;
  },
  DAGNodeProps
>((pre, { conditionWidth, conditionHeight, flipped }) => ({
  color: "lblue",
  height: conditionHeight,
  width: conditionWidth,
  hasInput: true,
  enabled: true,
  flipped,
  ...pre,
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
  onAddNode,
  onMove = {},
  color,
  hasInput = false,
  flipped,
  enabled,
  onSetEnabled,
}) => {
  const theme = useTheme();
  const confirm = useConfirm();
  const snackbr = useSnackbar();
  const nodeColor =
    color === "blue"
      ? theme.palette.info.main
      : color === "green"
      ? theme.palette.success.light
      : color === "lblue"
      ? theme.palette.info.light
      : color === "red"
      ? theme.palette.error.dark
      : "none";
  return (
    <>
      <div
        className={[
          "dagnode",
          flipped ? "flipped" : "",
          enabled ? "enabled" : "disabled",
        ].join(" ")}
        style={{
          height,
          width,
        }}
      >
        <div
          className="dagnode--inner"
          style={{
            maxHeight: `calc(${height}px - 1em)`,
            maxWidth: `calc(${width}px - 1em)`,
            minWidth: Math.max(width / 2, height / 2),
            borderBottomColor: theme.palette.grey[500],
            borderLeftColor: theme.palette.grey[700],
            borderRightColor: theme.palette.grey[700],
            borderTopColor: nodeColor,
            backgroundColor: enabled
              ? theme.palette.background.default
              : theme.palette.grey[600],
          }}
        >
          <SpeedDial
            icon={<SettingsOutlinedIcon className="dagnode--actions-btn" />}
          >
            <IconButton onClick={onEditClick} size="small">
              <Edit color="success" fontSize="inherit" />
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
            {onXClick && (
              <IconButton
                onClick={() => {
                  confirm({
                    description: "Are you sure you want to delete this node?",
                  })
                    .then(() => {
                      onXClick();
                      snackbr.enqueueSnackbar("Deleted.", {
                        variant: "info",
                      });
                    })
                    .catch(() =>
                      snackbr.enqueueSnackbar("Did not delete node.", {
                        variant: "info",
                      })
                    );
                }}
                size="small"
              >
                <DeleteForeverIcon fontSize="inherit" color="error" />
              </IconButton>
            )}
          </SpeedDial>
          {!!onSetEnabled && (
            <InputBoolean
              key="enabled-flag"
              className="dagnode--enabled-flag"
              label=""
              value={enabled}
              onChange={onSetEnabled}
            />
          )}
          {/* <Info className="dagnode--info-icon" style={{ color: nodeColor }} /> */}
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
          <div
            className="dagnode--label"
            style={{
              maxHeight: `calc(${height}px - 1em)`,
              maxWidth: `calc(${width}px - 1em)`,
              minHeight: `1em`,
            }}
          >
            {typeof label === "string" ? <span>{label}</span> : label}
          </div>
        </div>
        {onAddNode && (
          <div className="dagnode--midway-options">
            <ButtonIcon icon={<Add />} onClick={onAddNode} />
          </div>
        )}
      </div>
    </>
  );
};
