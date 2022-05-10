import "./index.css";

import { FC } from "react";
import { AutomationNode, AutomationNodeMapping } from 'types/automations/index';
import { useEditorNodeState } from "./OptionManager";
import { InputList } from "components/Inputs/InputList";
import { Button } from "components/Inputs/Button";

export interface Props {
  node: AutomationNode
  allowedTypes?: Array<keyof AutomationNodeMapping>;
  onClose?: () => void;
  onSave?: (n: AutomationNode) => void;
  onFlags?: (isReady: boolean, isModified: boolean) => void;
  saveBtnCreateText?: boolean;
}

export const NodeEditor: FC<Props> = ({
  node,
  allowedTypes = ["action", "condition", "trigger"],
  onClose = () => { },
  onSave = () => { },
  onFlags = () => { },
  saveBtnCreateText = false,
  children
}) => {
  // state
  const state = useEditorNodeState(node);

  // state
  const isModified = state.isModified;
  const isReady = state.isReady();

  // events
  onFlags(isReady, isModified);

  // render
  return <div className={["node-editor--root", isModified ? "modded" : ""].join(" ")}>
    <div className="node-editor--body">
      <div className="node-editor--body-title">
        {allowedTypes.length > 1 ? <InputList
          label="Type"
          current={state.nodeType}
          options={allowedTypes}
          onChange={state.setNodeType}
        /> : <></>}
        {state.nodeType !== 'condition' ? <InputList
          label={`${state.nodeType} type`}
          current={state.subType as any}
          options={state.subTypes}
          onChange={state.setSubType}
        /> : <></>}
      </div>
      {state.renderOptionList()}
    </div>
    <div className="node-editor--footer">
      <Button onClick={onClose}>Close</Button>
      <Button onClick={() => {
        isReady && onSave(state.data)
      }} disabled={!isReady}>{saveBtnCreateText ? "Create" : "Save"}</Button>
      {children}
    </div>
  </div>
}
