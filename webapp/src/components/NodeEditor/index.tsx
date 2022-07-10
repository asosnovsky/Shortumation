import "./index.css";

import { FC, ReactNode } from "react";
import { AutomationNode, AutomationNodeMapping } from "types/automations/index";
import { useEditorNodeState } from "./OptionManager";
import { InputList } from "components/Inputs/InputList";
import { Button } from "components/Inputs/Button";
import InputBoolean from "components/Inputs/InputBoolean";
import { useConfirm } from "material-ui-confirm";

export interface NodeEditorProps {
  node: AutomationNode;
  allowedTypes?: Array<keyof AutomationNodeMapping>;
  onClose?: () => void;
  onSave?: (n: AutomationNode) => void;
  onFlags?: (isReady: boolean, isModified: boolean) => void;
  saveBtnCreateText?: boolean;
  children?: ReactNode;
}

export const NodeEditor: FC<NodeEditorProps> = ({
  node,
  allowedTypes = ["action", "condition", "trigger"],
  onClose = () => {},
  onSave = () => {},
  onFlags = () => {},
  saveBtnCreateText = false,
  children,
}) => {
  // state
  const state = useEditorNodeState(node, allowedTypes, saveBtnCreateText);
  const confirm = useConfirm();

  // alias
  const isModified = state.isModified;
  const isReady = state.isReady();
  const areYouSureNotReady = async (
    what: string,
    checkModified: boolean = false
  ) => {
    const notes: string[] = [];
    if (!isReady) {
      notes.push("This node is missing some values");
    }
    if (state.isErrored) {
      notes.push("This node contains errors");
    }
    if (checkModified && isModified) {
      notes.push("This node is has some unsaved work");
    }
    if (notes.length > 0) {
      try {
        await confirm({
          description: (
            <ul>
              {notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          ),
        });
      } catch (_: any) {
        return false;
      }
    }
    return true;
  };

  // events
  onFlags(isReady, isModified);
  // render
  return (
    <div
      className={[
        "node-editor--root",
        isModified ? "modded" : "",
        !isReady && isModified ? "not-ready" : "",
        state.data.enabled === false ? "disabled" : "enabled",
      ].join(" ")}
    >
      <div className="node-editor--body">
        <div className="node-editor--body-title">
          {allowedTypes.length > 1 ? (
            <InputList
              label="Type"
              current={state.nodeType}
              options={allowedTypes}
              onChange={state.setNodeType}
              prettyOptionLabels
            />
          ) : (
            <></>
          )}
          {state.nodeType !== "condition" ? (
            <InputList
              label={state.prettyNodeType}
              current={state.subType as any}
              options={state.subTypes}
              onChange={state.setSubType}
              prettyOptionLabels
            />
          ) : (
            <></>
          )}
          <div className="node-editor--body-flags">
            <InputBoolean
              label="Yaml"
              onChange={state.setYamlMode}
              value={state.yamlMode}
              disabled={state.isErrored}
            />
            <InputBoolean
              className="enabled-flag"
              label="Enabled"
              value={state.data.enabled ?? true}
              onChange={state.setEnabled}
            />
          </div>
        </div>
        <div className="node-editor--body--options">
          {state.renderOptionList()}
        </div>
      </div>
      <div className="node-editor--footer">
        <Button
          className="node-editor--footer--close"
          onClick={() =>
            areYouSureNotReady("close", true).then((ok) => ok && onClose())
          }
        >
          Close
        </Button>
        <Button
          className="node-editor--footer--save"
          disabled={!isModified}
          onClick={() =>
            areYouSureNotReady("save").then((ok) => ok && onSave(state.data))
          }
          title={!isReady ? "Some fields have not been properly filled up" : ""}
        >
          {saveBtnCreateText ? "Create" : "Save"}
        </Button>
        {children}
      </div>
    </div>
  );
};
