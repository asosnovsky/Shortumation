import "./AutoInfoBox.css";
import { AutomationData, AutomationMetadata } from "types/automations";
import InputList from "components/Inputs/InputList";
import InputText from "components/Inputs/InputText";
import InputTextArea from "components/Inputs/InputTextArea";
import { FC, useRef, useState } from 'react';
import { AddIcon, TrashIcon } from "components/Icons";
import { Button } from "components/Inputs/Button";

interface Props {
  className: string;
  metadata: AutomationMetadata;
  tags: Array<[string, string]>;
  onUpdate: (m: AutomationMetadata, tags: Array<[string, string]>) => void;
}
export const AutoInfoBox: FC<Props> = ({
  metadata,
  tags,
  onUpdate,
  className,
  children,
}) => {
  // state
  const [newTag, setNewTag] = useState<[string, string]>(["", ""])
  const [[errorIndex, error], _setError] = useState<[number | 'new', string]>([-1, ""]);
  const errorTimeoutId = useRef(-1);

  // aliases
  const setError = (index: number | 'new', msg: string) => {
    _setError([index, msg])
    if (errorTimeoutId.current >= 0) {
      window.clearTimeout(errorTimeoutId.current);
    }
    errorTimeoutId.current = window.setTimeout(() => _setError([-1, ""]), 5000);
  }
  const onUpdateMetadata = <K extends keyof AutomationMetadata>(k: K) => (update: AutomationMetadata[K]) => onUpdate({
    ...metadata,
    [k]: update
  }, tags);
  const validTagName = (newName: string): string | undefined => {
    if (newName.length <= 0) {
      return "Must be at least 1 character long"
    }
    for (const [name, _] of tags) {
      if (name.trim() === newName.trim()) {
        return `The tag '${name}' already exists`
      }
    }
  }
  const updateTagName = (newName: string, tagIndex: number) => {
    const error = validTagName(newName);
    if (error) {
      return setError(tagIndex, error)
    }
    onUpdate(metadata, [
      ...tags.slice(0, tagIndex),
      [newName, tags[tagIndex][1]],
      ...tags.slice(tagIndex + 1),
    ])
  }
  const onUpdateTags = (tagValue: string, tagIndex: number) => onUpdate(metadata, [
    ...tags.slice(0, tagIndex),
    [tags[tagIndex][0], tagValue],
    ...tags.slice(tagIndex + 1),
  ])
  const addNewTag = () => {
    const error = validTagName(newTag[0]);
    if (error) {
      return setError('new', error)
    }
    onUpdate(metadata, tags.concat([newTag]));
    setNewTag(['', '']);
  }
  const onRemoveTag = (tagIndex: number) => onUpdate(metadata, [
    ...tags.slice(0, tagIndex),
    ...tags.slice(tagIndex + 1),
  ])
  // render
  return <div className={`automation-editor--info-box ${className}`}>
    <div className="automation-editor--info-box-inner">
      <InputText label="ID" value={metadata.id} onChange={onUpdateMetadata('id')} />
      <InputText label="Name" value={metadata.alias} onChange={onUpdateMetadata('alias')} />
      <InputTextArea label="Description" value={metadata.description} onChange={onUpdateMetadata('description')} />
      <InputList
        label="Mode"
        current={metadata.mode}
        onChange={onUpdateMetadata('mode')}
        options={[
          'parallel',
          'single',
          'queued',
          'restart'
        ]}
      />
      <div className="automation-editor--info-box--tags">
        <h1>Tags</h1>
        {tags.map(([tagName, tagValue], tagIndex) => <div className="automation-editor--info-box--tag">
          <Button onClick={() => onRemoveTag(tagIndex)} ><TrashIcon /></Button>
          <InputText value={tagName} label="Name" onChange={v => updateTagName(v, tagIndex)} />
          <InputText value={tagValue} label="Tag" onChange={v => onUpdateTags(v, tagIndex)} />
          <span className={["automation-editor--info-box--tag--error", (errorIndex === tagIndex) ? "show" : "hide"].join(" ")}>
            {error}
          </span>
        </div>)}
        <hr />
        <div className="automation-editor--info-box--tag">
          <InputText value={newTag[0]} label="Name" onChange={v => setNewTag([v, newTag[1]])} onEnter={addNewTag} />
          <InputText value={newTag[1]} label="Tag" onChange={v => setNewTag([newTag[0], v])} onEnter={addNewTag} />
          <Button onClick={addNewTag} ><AddIcon /></Button>
          <span className={["automation-editor--info-box--tag--error", (errorIndex === 'new') ? "show" : "hide"].join(" ")}>
            {error}
          </span>
        </div>
      </div>
    </div>
    {children}
  </div>
}
