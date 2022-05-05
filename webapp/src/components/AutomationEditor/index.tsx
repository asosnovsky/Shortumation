import "./index.css";
import { ArrowIcon, CheckMarkIcon } from "components/Icons";
import { FC, useState } from "react";
import { AutomationData } from "types/automations";
import { AutoInfoBox } from "./AutoInfoBox";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { Button } from "components/Inputs/Button";
import { useAutomatioEditorState } from "./state";
import { DAGAutomationFlow } from "components/DAGFlow";
import { DAGAutomationFlowDims } from "components/DAGFlow/types";

interface Props {
  automation?: AutomationData;
  dims: DAGAutomationFlowDims;
  onUpdate: (auto: AutomationData) => void;
}
export const AutomationEditor: FC<Props> = ({
  dims,
  automation: propsAutos,
  onUpdate: propsOnUpdate,
}) => {
  // state
  const {
    state,
    updateSequence,
    updateTrigger,
    updateMetadata,
    save,
  } = useAutomatioEditorState(propsAutos, propsOnUpdate);

  const [closeInfo, setCloseInfo] = useState(false);

  // render
  if (state.status === 'loading') {
    return <div className="automation-editor loading">
      Loading...
    </div>
  }
  return <div className="automation-editor">
    <AutoInfoBox
      className={closeInfo ? "hide" : "show"}
      metadata={state.data.metadata}
      tags={state.data.tags}
      onUpdate={updateMetadata}
    >
      <ButtonIcon
        className="automation-editor--info-box--icon"
        onClick={() => setCloseInfo(!closeInfo)}
        title={closeInfo ? "Show Metadata" : "Hide Metadata"}
      >{ArrowIcon}</ButtonIcon>
    </AutoInfoBox>

    <div className={["automation-editor--flow-wrapper", state.status].join(" ")}>
      <div className="automation-editor--flow-wrapper--toolbar">
        <Button
          className={"automation-editor--flow-wrapper--toolbar--save-btn"}
          onClick={save}
          disabled={state.status !== 'changed'}
        >
          Save <CheckMarkIcon color="#bf4" />
        </Button>
      </div>
      <DAGAutomationFlow
        className="automation-editor--flow-wrapper--flow"
        sequence={state.data.sequence}
        trigger={state.data.trigger}
        onSequenceUpdate={updateSequence}
        onTriggerUpdate={updateTrigger}
        dims={dims}
      />
    </div>
  </div>
}
