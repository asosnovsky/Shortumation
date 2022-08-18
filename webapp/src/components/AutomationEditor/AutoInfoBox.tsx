import "./AutoInfoBox.css";
import {
  AutomationMetadata,
  AutomationShortumationMetadata,
} from "types/automations";
import { InputList } from "components/Inputs/InputList";
import InputText from "components/Inputs/Base/InputText";
import { FC, ReactNode, useRef, useState } from "react";
import { AddIcon, TrashIcon } from "components/Icons";
import InputAutoText from "components/Inputs/InputAutoText";
import { TagDB } from "components/AutomationManager/TagDB";
import { ButtonIcon } from "components/Icons/ButtonIcons";

export interface AutoInfoBoxProps {
  metadata: AutomationMetadata & Partial<AutomationShortumationMetadata>;
  tags: Array<[string, string]>;
  onUpdate: (m: AutomationMetadata, tags: Array<[string, string]>) => void;
  tagDB: TagDB;
  children?: ReactNode;
}
export const AutoInfoBox: FC<AutoInfoBoxProps> = ({
  metadata,
  tags,
  onUpdate,
  children,
  tagDB,
}) => {
  // state
  const [newTag, setNewTag] = useState<[string, string]>(["", ""]);
  const [[errorIndex, error], _setError] = useState<[number | "new", string]>([
    -1,
    "",
  ]);
  const errorTimeoutId = useRef(-1);

  // aliases
  const foundNewTagNames = tagDB.getTagNames(tags.map(([n, _]) => n));
  const setError = (index: number | "new", msg: string) => {
    _setError([index, msg]);
    if (errorTimeoutId.current >= 0) {
      window.clearTimeout(errorTimeoutId.current);
    }
    errorTimeoutId.current = window.setTimeout(() => _setError([-1, ""]), 5000);
  };
  const onUpdateMetadata =
    <K extends keyof AutomationMetadata>(k: K) =>
    (update: AutomationMetadata[K]) =>
      onUpdate(
        {
          ...metadata,
          [k]: update,
        },
        tags
      );
  const validTagName = (newName: string): string | undefined => {
    if (newName.length <= 0) {
      return "Name must be at least 1 character long";
    }
    // eslint-disable-next-line
    for (const [name, _] of tags) {
      if (name.trim() === newName.trim()) {
        return `The tag '${name}' already exists`;
      }
    }
  };
  const updateTagName = (newName: string, tagIndex: number) => {
    const error = validTagName(newName);
    if (error) {
      return setError(tagIndex, error);
    }
    onUpdate(metadata, [
      ...tags.slice(0, tagIndex),
      [newName, tags[tagIndex][1]],
      ...tags.slice(tagIndex + 1),
    ]);
  };
  const onUpdateTags = (tagValue: string, tagIndex: number) =>
    onUpdate(metadata, [
      ...tags.slice(0, tagIndex),
      [tags[tagIndex][0], tagValue],
      ...tags.slice(tagIndex + 1),
    ]);
  const addNewTag = () => {
    const error = validTagName(newTag[0]);
    if (error) {
      return setError("new", error);
    }
    onUpdate(
      metadata,
      tags.concat([newTag.map((x) => x.trim()) as [string, string]])
    );
    setNewTag(["", ""]);
  };
  const onRemoveTag = (tagIndex: number) =>
    onUpdate(metadata, [
      ...tags.slice(0, tagIndex),
      ...tags.slice(tagIndex + 1),
    ]);
  // render
  return (
    <div className="automation-editor--info-box">
      <div className="automation-editor--info-box-inner">
        <InputText
          label="ID"
          value={metadata.id}
          onChange={onUpdateMetadata("id")}
        />
        <InputText
          label="Name"
          value={metadata.alias ?? ""}
          onChange={onUpdateMetadata("alias")}
        />
        <InputText
          multiline
          label="Description"
          value={metadata.description ?? ""}
          onChange={onUpdateMetadata("description")}
        />
        <InputList
          label="Mode"
          current={metadata.mode}
          onChange={onUpdateMetadata("mode")}
          options={["parallel", "single", "queued", "restart"]}
        />
        <div className="automation-editor--info-box--tags">
          <h1>Tags</h1>
          <div className="automation-editor--info-box--tag-list">
            {tags.map(([tagName, tagValue], tagIndex) => (
              <div key={tagIndex} className="automation-editor--info-box--tag">
                <InputAutoText
                  value={tagName}
                  label="Name"
                  onChange={(v) => updateTagName(v, tagIndex)}
                  options={foundNewTagNames}
                  error={errorIndex === tagIndex ? error : undefined}
                />
                <InputAutoText
                  value={tagValue}
                  label="Tag"
                  onChange={(v) => onUpdateTags(v, tagIndex)}
                  options={tagDB.getTagValues(tagName)}
                  error={errorIndex === tagIndex ? error : undefined}
                />
                <ButtonIcon
                  className="automation-editor--info-box--tag--trash"
                  onClick={() => onRemoveTag(tagIndex)}
                  icon={<TrashIcon />}
                />
              </div>
            ))}
          </div>
          <hr />
          <div className="automation-editor--info-box--tag">
            <InputAutoText
              value={newTag[0]}
              label="Name"
              onChange={(v) => setNewTag([v, newTag[1]])}
              options={foundNewTagNames}
              error={errorIndex === "new" ? error : undefined}
            />
            <InputAutoText
              value={newTag[1]}
              label="Tag"
              onChange={(v) => setNewTag([newTag[0], v])}
              options={tagDB.getTagValues(newTag[0])}
              error={errorIndex === "new" ? error : undefined}
            />
            <ButtonIcon
              className="automation-editor--info-box--tag--add"
              onClick={addNewTag}
              icon={<AddIcon />}
            />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
