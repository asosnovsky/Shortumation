import "./index.css";

import { FC, ReactNode } from "react";
import { AutomationNode, AutomationNodeMapping } from "types/automations/index";
import { useEditorNodeState } from "./OptionManager";
import { InputList } from "components/Inputs/InputList";
import { Button } from "components/Inputs/Buttons/Button";
import InputBoolean from "components/Inputs/Base/InputBoolean";
import { useConfirm } from "material-ui-confirm";
import { getNodeSubTypeDescription } from "./utils";
import { useLang } from "lang";

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
  const langStore = useLang();
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
      notes.push(langStore.get("VALIDATION_MISSING_VALUES_FOR_NODE"));
    }
    if (state.isErrored) {
      notes.push(langStore.get("VALIDATION_ERROR_VALUES_IN_NODE"));
    }
    if (checkModified && isModified) {
      notes.push(langStore.get("VALIDATION_UNSAVED_WORK_IN_NODE"));
    }
    if (notes.length > 0) {
      try {
        await confirm({
          confirmationText: "Yes",
          title: langStore.get("CONFIRM_EXIT", { what }),
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
              label={langStore.get("TYPE")}
              current={state.nodeType}
              options={allowedTypes}
              onChange={state.setNodeType}
              prettyOptionLabels={false}
            />
          ) : (
            <></>
          )}
          {state.nodeType !== "condition" ? (
            <InputList
              label={state.prettyNodeType}
              current={state.subType}
              getDescription={getNodeSubTypeDescription}
              options={state.subTypes}
              onChange={state.setSubType}
              prettyOptionLabels={false}
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
              label={langStore.get("ENABLED")}
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
          {langStore.get("CLOSE")}
        </Button>
        <Button
          className="node-editor--footer--save"
          disabled={!isModified}
          onClick={() =>
            areYouSureNotReady("save").then((ok) => ok && onSave(state.data))
          }
          title={
            !isReady ? langStore.get("VALIDATION_NOT_ALL_FIELD_FILLED_IN") : ""
          }
        >
          {saveBtnCreateText ? langStore.get("CREATE") : langStore.get("SAVE")}
        </Button>
        {children}
      </div>
    </div>
  );
};
