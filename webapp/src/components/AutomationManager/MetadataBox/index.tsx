import "./index.css";
import "./index.mobile.css";
import { FC } from "react";

import Switch from "@mui/material/Switch";
import Alert from "@mui/material/Alert";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SelectIcon from "@mui/icons-material/HighlightAltSharp";
import RunIcon from "@mui/icons-material/RunCircleOutlined";

import { InputTextView } from "components/Inputs/InputTextView";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { AutomationManagerAuto } from "../types";
import { Tags } from "./Tags";
import { TagDB } from "../TagDB";
import { Chip, Tooltip } from "@mui/material";
import { useLang } from "lang";

export type MetadataBoxProps = AutomationManagerAuto & {
  onDelete: () => void;
  onSelect: () => void;
  onRun: () => void;
  onStateUpdate: (s: "on" | "off") => void;
  onTitleUpdate: (t: string) => void;
  onDescriptionUpdate: (t: string) => void;
  tagsDB: TagDB;
  isSelected: boolean;
};
export const MetadataBox: FC<MetadataBoxProps> = (props) => {
  const isValidState = ["on", "off"].includes(props.state);
  const langStore = useLang();
  const prettyState = ["on", "off"].includes(props.state)
    ? langStore.get(`AUTOMATION_STATE_${props.state}`)
    : props.state;
  return (
    <div
      className={[
        "automation-manager--metadatabox",
        props.isSelected ? "selected" : "",
        props.isNew ? "new" : "",
      ].join(" ")}
    >
      <div
        className="metadatabox--switch"
        title={
          !isValidState
            ? langStore.get("ERROR_INVALID_AUTOMATION_STATE")
            : langStore.get("AUTOMATION_STATE_IS", {
                state: prettyState,
              })
        }
      >
        <Switch
          checked={props.state !== "off"}
          onChange={() =>
            props.onStateUpdate(props.state === "on" ? "off" : "on")
          }
          disabled={!isValidState}
          color={!isValidState ? "error" : "info"}
        />
        {!isValidState && props.state}
      </div>
      <div className="metadatabox--title">
        <span className="metadatabox--title--source">
          <Tooltip
            title={langStore.get("AUTOMATION_METADATA_TOOLTIP_TEXT", {
              source_file: props.source_file,
              state: prettyState,
              entityId: props.entityId,
              id: props.id,
            })}
          >
            <Chip
              label={`@${props.source_file} (${props.source_file_type}) - ${
                props.entityId ?? langStore.get("N/A")
              }`}
              className="text-ellipsis"
            />
          </Tooltip>
        </span>
        <Tooltip title={`ID=${props.id}, EntityID=${props.entityId}`}>
          <InputTextView
            className="title"
            placeholder={langStore.get("TITLE")}
            value={props.title}
            onChange={props.onTitleUpdate}
            disabled={props.isNew}
          />
        </Tooltip>
        <InputTextView
          className="description"
          placeholder={langStore.get("DESCRIPTION")}
          value={props.description}
          onChange={props.onDescriptionUpdate}
          disabled={props.isNew}
        />
        {!props.isNew && <Tags automationId={props.id} tagsDB={props.tagsDB} />}
        {props.issue ? (
          <Alert severity="warning" className="issue">
            {props.issue}
          </Alert>
        ) : (
          <></>
        )}
      </div>
      <div className="buttons">
        <ButtonIcon
          className="select"
          icon={<SelectIcon />}
          onClick={props.onSelect}
          title={langStore.get("SELECT_AUTOMATION")}
        />
        <ButtonIcon
          className="run"
          icon={<RunIcon />}
          onClick={props.onRun}
          title={langStore.get("TRIGGER_AUTOMATION")}
        />
        <ButtonIcon
          className="delete"
          icon={<DeleteForeverIcon />}
          onClick={props.onDelete}
          title={langStore.get("DELETE_AUTOMATION")}
        />
      </div>
    </div>
  );
};
