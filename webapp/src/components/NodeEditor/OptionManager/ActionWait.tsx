import "./ActionWait.css";
import InputBoolean from "components/Inputs/InputBoolean";
import { InputList } from "components/Inputs/InputList";
import InputNumber from "components/Inputs/InputNumber";
import InputText from "components/Inputs/InputText";
import { InputTime } from "components/Inputs/InputTime";
import { useState } from "react";
import { DelayAction, WaitAction } from "types/automations/actions";
import { OptionManager, updateActionData } from './OptionManager';
import { getNodeSubType } from 'utils/automations';
import InputYaml from "components/Inputs/InputYaml";

type ThisAction = WaitAction | DelayAction;
type Option = 'delay' | 'template' | 'trigger'
const getCurrentOption = (node: ThisAction): Option => {
  if (getNodeSubType(node) === 'delay') {
    return 'delay'
  } else {
    return 'template'
  }
}

export const ActionWaitState: OptionManager<ThisAction> = {
  defaultState: () => ({
    delay: "",
  }),
  isReady: () => true,
  Component: ({ state, setState }) => {
    // state
    const update = updateActionData(state, setState);
    const [current, _setCurrent] = useState(getCurrentOption(state));
    const setCurrent = (opt: Option) => {
      _setCurrent(opt)
    }

    // determine options
    let option: JSX.Element = <></>;
    if (current === "delay") {
      option = <>
        <InputTime className="for" label="for" value={(state as any).delay} onChange={delay => update({ delay })} />
      </>
    } else if (current === 'template') {
      state = state as WaitAction;
      option = <>
        <InputText
          label="Template"
          className="template"
          value={state.wait_template ?? ""}
          onChange={wait_template => update({ wait_template })}
        />
      </>
    } else if (current === 'trigger') {
      state = state as WaitAction;
      option = <>
        <InputYaml
          className="triggers"
          label="Triggers"
          value={state.wait_for_trigger ?? []}
          onChange={wait_for_trigger => update({ wait_for_trigger })}
        />
      </>
    }

    // render
    return <div className="node-editor--action-wait">
      <InputList
        className="wait-type"
        label="Wait Type" prettyOptionLabels
        options={["template", 'trigger', "delay"]}
        current={current} onChange={setCurrent} />
      {option}
      {current !== 'delay' ? <div className="wait-options">
        <InputNumber
          label="Timeout"
          value={(state as any).timeout ? Number((state as any).timeout) : 0}
          onChange={(timeout = 0) => update({ timeout: String(timeout) })}
        />
        <InputBoolean
          label="Continue on Timeout"
          value={(state as any).continue_on_timeout ?? false}
          onChange={continue_on_timeout => update({ continue_on_timeout })}
        />
      </div> : <></>}
    </div>
  }
}
