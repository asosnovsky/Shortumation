import "./AutomationMetadataBox.css";
import { CheckMarkIcon } from "components/Icons";
import { FC, useState } from "react";
import { AutomationMetadata } from "types/automations";
import { InputAutoComplete } from "components/Inputs/InputAutoComplete";
import { TagDB } from "./TagDB";
import { cleanUpUndefined } from "components/NodeEditor/OptionManager/OptionManager";

export const MetadataBox: FC<{
  metadata: AutomationMetadata;
  tags: Record<string, string>;
  tagsDB: TagDB;
}> = (auto) => {
  const [tags, setTags] = useState(auto.tags);
  const tagOptions = auto.tagsDB.getTagNames(Object.keys(tags));
  let title = <span>{"BadAuto<<Missing Metadata>>"}</span>;
  if (auto.metadata) {
    title = (
      <>
        <b>
          {String(auto.metadata.alias ?? "").slice(0, 15)}{" "}
          <span>({String(auto.metadata.id).slice(0, 5)})</span>
        </b>
        <span>{String(auto.metadata.description ?? "").slice(0, 25)}</span>
      </>
    );
  }
  return (
    <div className="automation-list-box--body--item--title">
      {title}
      <div className="automation-list-box--body--item--tags">
        {Object.keys(tags).map((tagName) => (
          <MetadataBoxTag
            options={[tagOptions, auto.tagsDB.getTagValues(tagName)]}
            key={tagName}
            value={[tagName, tags[tagName]]}
            onChange={([newName, newValue]) =>
              setTags(
                cleanUpUndefined({
                  ...tags,
                  [tagName]: undefined,
                  [newName]: newValue,
                })
              )
            }
          />
        ))}
        <span className="automation-list-box--body--item--tags--add">+</span>
      </div>
    </div>
  );
};

export const MetadataBoxTag: FC<{
  value: [string, string];
  onChange: (t: [string, string]) => void;
  options: [string[], string[]];
}> = (props) => {
  const [[editMode1, editMode2], setEditMode] = useState([false, false]);
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
