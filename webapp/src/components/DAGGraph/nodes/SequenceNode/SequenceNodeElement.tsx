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
import { AddOutlined } from "@mui/icons-material";

export const SequenceNodeElement: FC<
  PropsWithChildren<SequenceNodeElementProps>
> = ({
  label,
  height,
  width,
  onXClick,
  onEditClick = () => {},
  onAdd = {},
  onMove = {},
  color,
  flipped,
  enabled,
  onSetEnabled,
  children,
}) => {
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
        style={
          {
            "--sequence-node-height": height + "px",
            "--sequence-node-width": width + "px",
            "--sequence-node-color": nodeColor,
          } as any
        }
      >
        <div className="sequence-node--inner">
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
                key={"move" + key}
                onClick={action}
                size="small"
                className={["sequence-node--actions--move", key].join(" ")}
              >
                <ArrowBackIcon className="icon" fontSize="inherit" />
              </IconButton>
            ))}
            {Object.entries(onAdd).map(([key, action]) => (
              <IconButton
                key={"add" + key}
                onClick={action}
                size="small"
                className={["sequence-node--actions--move", key].join(" ")}
              >
                <ArrowBackIcon className="icon" fontSize="inherit" />
                <AddOutlined className="icon-2" fontSize="inherit" />
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
          <div className="sequence-node--label">
            {typeof label === "string" ? <span>{label}</span> : label}
          </div>
        </div>
      </div>
    </>
  );
};
