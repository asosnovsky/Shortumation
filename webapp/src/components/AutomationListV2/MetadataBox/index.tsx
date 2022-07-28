import "./index.css";
import { FC } from "react";

import Switch from "@mui/material/Switch";
import Alert from "@mui/material/Alert";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SelectIcon from "@mui/icons-material/HighlightAltSharp";

import { InputTextView } from "components/Inputs/InputTextView";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { AutomationListAuto } from "../types";
import { Tags } from "./Tags";
import { TagDB } from "../TagDB";

export type MetadataBoxProps = AutomationListAuto & {
  onDelete: () => void;
  onSelect: () => void;
  onStateUpdate: (s: "on" | "off") => void;
  onTagUpdate: (t: Record<string, string>) => void;
  onTitleUpdate: (t: string) => void;
  onDescriptionUpdate: (t: string) => void;
  tagsDB: TagDB;
};
export const MetadataBox: FC<MetadataBoxProps> = (props) => {
  const isValidState = ["on", "off"].includes(props.state);
  return (
    <div
      className={[
        "automation-list--metadatabox",
        props.isSelected ? "selected" : "",
      ].join(" ")}
    >
      <div
        className="metadatabox--switch"
        title={!isValidState ? "Invalid state" : `Automation is ${props.state}`}
      >
        <Switch
          checked={props.state !== "off"}
          onChange={() =>
            props.onStateUpdate(props.state === "on" ? "off" : "on")
          }
          disabled={!isValidState}
          color={!isValidState ? "error" : "info"}
        />
        {!isValidState && `Invalid state: '${props.state}'`}
      </div>
      <div className="metadatabox--title">
        <InputTextView
          className="title"
          placeholder="Title"
          value={props.title}
          onChange={props.onTitleUpdate}
        />
        <InputTextView
          className="description"
          placeholder="Description"
          value={props.description}
          onChange={props.onDescriptionUpdate}
        />
        <Tags
          tags={props.tags}
          onUpdate={props.onTagUpdate}
          tagsDB={props.tagsDB}
        />
        {props.issue ? (
          <Alert severity="warning" className="issue">
            {props.issue}
          </Alert>
        ) : (
          <></>
        )}
      </div>
      <ButtonIcon
        className="select"
        icon={<SelectIcon />}
        onClick={props.onSelect}
      />
      <ButtonIcon
        className="delete"
        icon={<DeleteForeverIcon />}
        onClick={props.onDelete}
      />
    </div>
  );
};
