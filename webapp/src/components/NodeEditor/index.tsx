import "./index.css";

import { FC, ReactNode } from 'react';
import { AutomationNode, AutomationNodeMapping } from 'types/automations/index';
import { useEditorNodeState } from "./OptionManager";
import { InputList } from "components/Inputs/InputList";
import { Button } from "components/Inputs/Button";
import InputBoolean from "components/Inputs/InputBoolean";

export interface NodeEditorProps {
  node: AutomationNode
  allowedTypes?: Array<keyof AutomationNodeMapping>;
  onClose?: () => void;
  onSave?: (n: AutomationNode) => void;
  onFlags?: (isReady: boolean, isModified: boolean) => void;
  saveBtnCreateText?: boolean;
  isErrored?: boolean;
  children?: ReactNode;
}

export const NodeEditor: FC<NodeEditorProps> = ({
  node,
  allowedTypes = ["action", "condition", "trigger"],
  onClose = () => { },
  onSave = () => { },
  onFlags = () => { },
  saveBtnCreateText = false,
  children,
  isErrored = false,
}) => {
  // state
  const state = useEditorNodeState(node, isErrored, allowedTypes);

  // alias
  const isModified = state.isModified;
  const isReady = state.isReady();
  const areYouSureNotReady = (what: string) => !isReady ?
    window.confirm(`This node is missing some values, are you sure you want to ${what}?`) :
    state.isErrored ?
      window.confirm(`This node contains errors, are you sure you want to ${what}?`) :
      true;

  // events
  onFlags(isReady, isModified);
  // render
  return <div className={["node-editor--root", isModified ? "modded" : "", (!isReady && isModified) ? 'not-ready' : ''].join(" ")}>
    <div className="node-editor--body">
      <div className="node-editor--body-title">
        {allowedTypes.length > 1 ? <InputList
          label="Type"
          current={state.nodeType}
          options={allowedTypes}
          onChange={state.setNodeType}
        /> : <></>}
        {state.nodeType !== 'condition' ? <InputList
          label={state.prettyNodeType}
          current={state.subType as any}
          options={state.subTypes}
          onChange={state.setSubType}
        /> : <></>}
        <InputBoolean label="Yaml" onChange={state.setYamlMode} value={state.yamlMode} disabled={state.isErrored} />
      </div>
      {state.renderOptionList()}
    </div>
    <div className="node-editor--footer">
      <Button className="node-editor--footer--close" onClick={() => areYouSureNotReady('close') && onClose()}>Close</Button>
      <Button
        className="node-editor--footer--save"
        onClick={() => {
          if (areYouSureNotReady('save')) {
            onSave(state.data)
          }
        }}
        title={
          !isReady ? "Some fields have not been properly filled up" : ""
        }
      >
        {saveBtnCreateText ? "Create" : "Save"}
      </Button>
      {children}
    </div>
  </div>
}
