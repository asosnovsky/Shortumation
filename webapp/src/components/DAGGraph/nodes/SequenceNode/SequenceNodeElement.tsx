import "./SequenceNode.css";

import { FC, PropsWithChildren } from "react";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";

import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Edit from "@mui/icons-material/Edit";
import Add from "@mui/icons-material/Add";

import InputBoolean from "components/Inputs/InputBoolean";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { SpeedDial } from "components/SpeedDial";
import { SequenceNodeElementProps } from "./types";
import { useSequenceNodeColor } from "./util";

export const SequenceNodeElement: FC<
  PropsWithChildren<SequenceNodeElementProps>
> = ({
  label,
  height,
  width,
  onXClick,
  onEditClick = () => {},
  onAddNode,
  onMove = {},
  color,
  flipped,
  enabled,
  onSetEnabled,
  children,
}) => {
  const theme = useTheme();
  const confirm = useConfirm();
  const snackbr = useSnackbar();
  const nodeColor = useSequenceNodeColor(color);
  return (
    <>
      <div
        className={[
          "sequence-node",
          flipped ? "flipped" : "",
          enabled ? "enabled" : "disabled",
        ].join(" ")}
        style={{
          height,
          width,
        }}
      >
        <div
          className="sequence-node--inner"
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
            icon={
              <SettingsOutlinedIcon className="sequence-node--actions-btn" />
            }
          >
            <IconButton onClick={onEditClick} size="small">
              <Edit color="success" fontSize="inherit" />
            </IconButton>
            {Object.entries(onMove).map(([key, action]) => (
              <IconButton
                key={key}
                onClick={action}
                size="small"
                className={["sequence-node--actions--move", key].join(" ")}
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
              className="sequence-node--enabled-flag"
              label=""
              value={enabled}
              onChange={onSetEnabled}
            />
          )}
          {children}
          <div
            className="sequence-node--label"
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
          <div className="sequence-node--midway-options">
            <ButtonIcon icon={<Add />} onClick={onAddNode} />
          </div>
        )}
      </div>
    </>
  );
};
