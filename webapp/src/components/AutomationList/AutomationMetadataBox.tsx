import "./AutomationMetadataBox.css";
import { CheckMarkIcon } from "components/Icons";
import { FC, useState } from "react";
import { AutomationMetadata } from "types/automations";
import { InputAutoComplete } from "components/Inputs/InputAutoComplete";
import { TagDB } from "./TagDB";

export const MetadataBox: FC<{
  metadata: AutomationMetadata;
  onUpdate: (t: [string, string][]) => void;
  tags: [string, string][];
  tagsDB: TagDB;
}> = ({ tags, onUpdate, tagsDB, metadata }) => {
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
        <b>
          {String(metadata.alias ?? "").slice(0, 15)}{" "}
          <span>({String(metadata.id).slice(0, 5)})</span>
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
            onChange={([newName, newValue]) =>
              onUpdate([
                ...tags.slice(0, tagIndex),
                [newName, newValue],
                ...tags.slice(tagIndex + 1),
              ])
            }
          />
        ))}
        {newTag.on && (
          <MetadataBoxTag
            options={[tagOptions, tagsDB.getTagValues(newTag.name)]}
            key="new"
            value={[newTag.name, newTag.value]}
            initialState={[true, true]}
            onChange={([name, value]) => {
              if (name.trim() !== "" && value.trim() !== "") {
                setNewTag({
                  on: false,
                });
                onUpdate([...tags, [name, value]]);
              } else {
                setNewTag({
                  on: true,
                  name,
                  value,
                });
              }
            }}
          />
        )}
        {!newTag.on && (
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
  initialState?: [boolean, boolean];
}> = (props) => {
  const [[editMode1, editMode2], setEditMode] = useState(
    props.initialState ? props.initialState : [false, false]
  );
  const toggle1 = () => setEditMode([!editMode1, editMode2]);
  const toggle2 = () => setEditMode([editMode1, !editMode2]);
  return (
    <span className="automation-list-box--body--item--tags--item">
      {editMode1 ? (
        <InputAutoComplete
          multiple={false}
          className="text"
          disableChips
          options={props.options[0]}
          label=""
          value={props.value[0]}
          onEnter={toggle1}
          onChange={(v) => props.onChange([v ?? "", props.value[1]])}
          onlyShowLabel
          endAdornment={<CheckMarkIcon className="icon" onClick={toggle1} />}
        />
      ) : (
        <b className="text" onClick={toggle1}>
          {props.value[0]}:
        </b>
      )}
      {editMode2 ? (
        <InputAutoComplete
          multiple={false}
          className="text"
          disableChips
          options={props.options[1]}
          label=""
          value={props.value[1]}
          onEnter={toggle2}
          onChange={(v) => props.onChange([props.value[0], v ?? ""])}
          onlyShowLabel
          endAdornment={<CheckMarkIcon className="icon" onClick={toggle2} />}
        />
      ) : (
        <span className="text" onClick={toggle2}>
          {props.value[1]}
        </span>
      )}
    </span>
  );
};
