import "./ConditionNodeBase.css";
import "./ConditionNodeBase.mobile.css";

import { InputList } from "components/Inputs/InputList";
import { FC, useState } from "react";
import { AutomationCondition } from "types/automations/conditions";
import { getSubTypeList } from "utils/automations";
import { getConditionDefaultValues } from "utils/defaults";
import { useHA } from "services/ha";
import InputYaml from "components/Inputs/Base/InputYaml";
import { getViewer } from "./viewRender";
import { getEditor } from "./editorRender";
import useWindowSize from "utils/useWindowSize";
import { ConditionNodeSettings } from "./ConditionNodeSettings";
import { useLang } from "services/lang";

export type ConditionNodeBaseProps = {
  condition: AutomationCondition;
  onDelete?: () => void;
  onUpdate: (data: AutomationCondition) => void;
  disableDelete?: boolean;
  initialViewMode?: ConditionNodeBaseViewMode;
};
export type ConditionNodeBaseViewMode = "edit" | "yaml" | "view";
export const ConditionNodeBase: FC<ConditionNodeBaseProps> = (props) => {
  // state
  const ha = useHA();
  const langStore = useLang();
  const { isMobile } = useWindowSize();
  const [{ isEdited, condition }, setCondition] = useState<{
    isEdited: boolean;
    condition: AutomationCondition;
  }>({
    isEdited: false,
    condition: props.condition,
  });
  const [mode, setMode] = useState<ConditionNodeBaseViewMode>(
    props.initialViewMode ?? "view"
  );
  //   alias
  const updateCondition = (data: any) =>
    setCondition({
      isEdited: true,
      condition: data,
    });

  // children
  let childrenConditions: JSX.Element;
  if (mode === "view") {
    const Viewer = getViewer(condition);
    childrenConditions = (
      <Viewer
        condition={condition}
        onChange={updateCondition}
        namer={ha.namer}
      />
    );
  } else {
    const Editor = getEditor(condition);
    childrenConditions = (
      <Editor
        condition={condition}
        onChange={updateCondition}
        ha={ha}
        initialViewMode="edit"
        langStore={langStore}
      />
    );
  }
  // icons
  const icons = (
    <ConditionNodeSettings
      onDelete={props.onDelete}
      onModeSwitch={setMode}
      onSave={() => {
        props.onUpdate(condition);
        setCondition({
          isEdited: false,
          condition,
        });
      }}
      mode={mode}
      isEdited={isEdited}
      disableDelete={props.disableDelete ?? false}
    />
  );
  //   render
  return (
    <div
      className={["condition-node-base", isEdited ? "is-edited" : ""].join(" ")}
    >
      <div className="condition-node-base--list">
        <InputList
          label=""
          className="condition-node-base--list--select"
          current={condition.condition}
          options={getSubTypeList("condition")}
          onChange={(n: any) =>
            setCondition({
              isEdited: true,
              condition: {
                ...getConditionDefaultValues(n),
                condition: n,
              },
            } as any)
          }
          prettyOptionLabels={false}
        />
        {isMobile && icons}
      </div>
      <div className={["condition-node-base--body", mode].join(" ")}>
        {mode === "yaml" ? (
          <InputYaml
            key="yaml"
            label=""
            value={condition}
            onChange={updateCondition}
          />
        ) : (
          <div
            className={["condition-node-base--body--children", mode].join(" ")}
          >
            {childrenConditions}
          </div>
        )}
        {!isMobile && icons}
      </div>
    </div>
  );
};
