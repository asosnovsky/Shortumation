import "./index.css";

import { FC } from "react";
import { AutomationNode, AutomationNodeMapping } from 'types/automations/index';
import { useEditorNodeState } from "./OptionManager";
import InputList from "components/Inputs/InputList";
import { Button } from "components/Inputs/Button";

export interface Props {
  node: AutomationNode
  allowedTypes?: Array<keyof AutomationNodeMapping>;
  onClose?: () => void;
  onSave?: (n: AutomationNode) => void;
  saveBtnCreateText?: boolean;
}

export const NodeEditor: FC<Props> = ({
  node,
  allowedTypes = ["action", "condition", "trigger"],
  onClose = () => { },
  onSave = () => { },
  saveBtnCreateText = false,
}) => {
  const state = useEditorNodeState(node);

  return <div className="node-editor--root">
    <div className="node-editor--body">
      <div className="node-editor--body-title">
        {allowedTypes.length > 1 ? <InputList
          label="Type"
          current={state.nodeType}
          options={allowedTypes}
          onChange={state.setNodeType}
        /> : <span>{state.nodeType}</span>}
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
        state.isReady() && onSave(state.data)
      }} disabled={!state.isReady()}>{saveBtnCreateText ? "Create" : "Save"}</Button>
    </div>
  </div>
}
