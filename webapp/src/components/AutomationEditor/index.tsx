import "./index.css";
import { ArrowIcon, CheckMarkIcon } from "components/Icons";
import { FC, useState } from "react";
import { AutomationData } from "types/automations";
import { AutoInfoBox } from "./AutoInfoBox";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { Button } from "components/Inputs/Button";
import { useAutomatioEditorState, EditorData } from './state';
import { SafeDAGAutomationFlow } from "components/DAGFlow/safe";
import { DAGAutomationFlowDims } from "components/DAGFlow/types";
import { MiniFailure } from 'types/validators/helper';
import InputYaml from "components/Inputs/InputYaml";

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
    updateCondition,
    validate,
    save,
    saveAndUpdate,
  } = useAutomatioEditorState(propsAutos, propsOnUpdate);

  const [closeInfo, setCloseInfo] = useState(false);

  // render
  if (state.status === 'loading') {
    return <div className="automation-editor loading">
      Loading...
    </div>
  }
  if (state.status === 'invalid') {
    return <ValidationBox
      failures={state.failures}
      data={state.data}
      validate={validate}
      onSave={saveAndUpdate}
    />
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
      <SafeDAGAutomationFlow
        className="automation-editor--flow-wrapper--flow"
        sequence={state.data.sequence}
        trigger={state.data.trigger}
        condition={state.data.condition}
        onSequenceUpdate={updateSequence}
        onTriggerUpdate={updateTrigger}
        onConditionUpdate={updateCondition}
        dims={dims}
      />
    </div>
  </div>
}


export const ValidationBox: FC<{
  failures: MiniFailure[]
  validate: (d: any) => MiniFailure[] | null,
  data: EditorData,
  onSave: (d: EditorData) => void,
}> = props => {

  const [{ failures, data }, setState] = useState({
    failures: props.failures,
    data: props.data,
  });

  const makeSave = <K extends keyof EditorData>(k: K) => (d: EditorData[K]) => {
    const newData = {
      ...data,
      [k]: d,
    }
    const newFails = props.validate(newData);
    if (newFails) {
      setState({
        failures: newFails,
        data: newData,
      })
    } else {
      setState({
        failures: [],
        data: newData,
      })
    }
  }

  return <div className="automation-editor-failures">
    <ul>
      {failures.map((f, i) => <>
        <li key={i}>
          <b>{f.path}</b>:
          <ul>
            {f.message.map((m, j) => <li key={j}>
              {m}
            </li>)}
          </ul>
        </li>
      </>)}
    </ul>
    <span>Please correct the automation file manually and then continue!</span>
    <InputYaml label="Metadata" value={data.metadata} onChange={makeSave('metadata')} resizable />
    <InputYaml label="Tags" value={data.tags} onChange={makeSave('tags')} resizable />
    <InputYaml label="Trigger" value={data.trigger} onChange={makeSave('trigger')} resizable />
    <InputYaml label="Condition" value={data.condition} onChange={makeSave('condition')} resizable />
    <InputYaml label="Actions" value={data.sequence} onChange={makeSave('sequence')} resizable />
    <Button disabled={failures.length > 0} onClick={() => props.onSave(data)}>Save</Button>
  </div>
}