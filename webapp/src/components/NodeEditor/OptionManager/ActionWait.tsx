import InputBoolean from "components/Inputs/InputBoolean";
import InputText from "components/Inputs/InputText";
import { WaitAction } from "types/automations/actions";
import { OptionManager, updateActionData } from './OptionManager';


export const ActionWaitState: OptionManager<WaitAction> = {
  defaultState: () => ({
    $smType: 'action',
    action: 'wait',
    action_data: {
      alias: "Wait",
      wait_template: "",
      // timeout: 0,
      continue_on_timeout: false,
    }
  }),
  isReady: ({
    action_data: { alias, wait_template }
  }) => (
    alias !== '' &&
    wait_template !== ""
  ),
  renderOptionList: (state, setState) => {
    const update = updateActionData(state, setState);
    return <div className="state-manager-options">
      <InputText
        label="Description"
        value={state.action_data.alias}
        onChange={alias => update({ alias })}
      />
      <InputText
        textBoxFor="template"
        label="Template"
        value={state.action_data.wait_template}
        onChange={wait_template => update({ wait_template })}
      />
      {/* <InputNumber
        label="Timeout"
        value={state.action_data.timeout ?? 0}
        onChange={(timeout = 0) => update({ timeout })}
      /> */}
      <InputBoolean
        label="Continue on Timeout"
        value={state.action_data.continue_on_timeout ?? false}
        onChange={continue_on_timeout => update({ continue_on_timeout })}
      />
    </div>
  }
}
