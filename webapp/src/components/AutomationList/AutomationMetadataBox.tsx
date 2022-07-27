import "./AutomationMetadataBox.css";
import { CheckMarkIcon } from "components/Icons";
import { FC, useState } from "react";
import { AutomationMetadata } from "types/automations";
import { InputAutoComplete } from "components/Inputs/InputAutoComplete";
import { TagDB } from "./TagDB";
import DeleteIcon from "@mui/icons-material/ClearTwoTone";
import { InputTextView } from "components/Inputs/InputTextView";
import { useHAEntities } from "haService/HAEntities";

export const MetadataBox: FC<{
  metadata: AutomationMetadata;
  onAliasUpdate: (t: string) => void;
  onTagUpdate: (t: [string, string][]) => void;
  tags: [string, string][];
  tagsDB: TagDB;
}> = ({ tags, onTagUpdate, onAliasUpdate, tagsDB, metadata }) => {
  // state
  const [newTag, setNewTag] = useState<
    | {
        on: false;
      }
    | {
        on: true;
        name: string;
        value: string;
      }
  >({ on: false });
  // alias
  const tagOptions = tagsDB.getTagNames(tags.map((t) => t[0]));

  // render
  let title = <span>{"BadAuto<<Missing Metadata>>"}</span>;
  if (metadata) {
    title = (
      <>
        <b className="text">
          <InputTextView
            value={metadata.alias ?? ""}
            onChange={onAliasUpdate}
          />
          <span>({String(metadata.id).slice(0, 10)})</span>
        </b>
        <span>{String(metadata.description ?? "").slice(0, 25)}</span>
      </>
    );
  }
  return (
    <div className="automation-list-box--body--item--title">
      {title}
      <div className="automation-list-box--body--item--tags">
        {tags.map(([tagName, tagValue], tagIndex) => (
          <MetadataBoxTag
            options={[tagOptions, tagsDB.getTagValues(tagName)]}
            key={tagIndex}
            value={[tagName, tagValue]}
            onDelete={() =>
              onTagUpdate([
                ...tags.slice(0, tagIndex),
                ...tags.slice(tagIndex + 1),
              ])
            }
            onChange={([newName, newValue]) =>
              onTagUpdate([
                ...tags.slice(0, tagIndex),
                [newName, newValue],
                ...tags.slice(tagIndex + 1),
              ])
            }
          />
        ))}
        {newTag.on ? (
          <MetadataBoxTag
            options={[tagOptions, tagsDB.getTagValues(newTag.name)]}
            key="new"
            value={[newTag.name, newTag.value]}
            initialState={true}
            onChange={([name, value]) => {
              setNewTag({
                on: true,
                name,
                value,
              });
            }}
            onToggle={(em) => {
              if (!em) {
                if (newTag.name.trim() !== "" && newTag.value.trim() !== "") {
                  onTagUpdate(tags.concat([[newTag.name, newTag.value]]));
                  setNewTag({
                    on: false,
                  });
                }
              }
              setNewTag({
                on: false,
              });
            }}
          />
        ) : (
          <span
            className="automation-list-box--body--item--tags--add"
            onClick={() =>
              setNewTag({
                on: true,
                name: "",
                value: "",
              })
            }
          >
            +
          </span>
        )}
      </div>
    </div>
  );
};

export const MetadataBoxTag: FC<{
  value: [string, string];
  onChange: (t: [string, string]) => void;
  options: [string[], string[]];
  initialState?: boolean;
  onToggle?: (em: boolean) => void;
  onDelete?: () => void;
}> = (props) => {
  const [editMode, setEditMode] = useState(
    props.initialState ? props.initialState : false
  );
  const toggle = () => {
    if (editMode) {
      if (props.value[0].trim() === "" || props.value[1].trim() === "") {
        props.onToggle && props.onToggle(true);
        return setEditMode(true);
      }
    }
    props.onToggle && props.onToggle(!editMode);
    setEditMode(!editMode);
  };
  return (
    <span className="automation-list-box--body--item--tags--item">
      {props.onDelete && (
        <DeleteIcon onClick={props.onDelete} className="delete" />
      )}
      {editMode ? (
        <InputAutoComplete
          multiple={false}
          className="text"
          disableChips
          options={props.options[0]}
          label=""
          value={props.value[0]}
          onEnter={toggle}
          onChange={(v) => props.onChange([v ?? "", props.value[1]])}
          onlyShowLabel
          endAdornment={<CheckMarkIcon className="icon" onClick={toggle} />}
        />
      ) : (
        <b className="text" onClick={toggle}>
          {props.value[0]}:
        </b>
      )}
      {editMode ? (
        <InputAutoComplete
          multiple={false}
          className="text"
          disableChips
          options={props.options[1]}
          label=""
          value={props.value[1]}
          onEnter={toggle}
          onChange={(v) => props.onChange([props.value[0], v ?? ""])}
          onlyShowLabel
          endAdornment={<CheckMarkIcon className="icon" onClick={toggle} />}
        />
      ) : (
        <span className="text" onClick={toggle}>
          {props.value[1]}
        </span>
      )}
    </span>
  );
};
