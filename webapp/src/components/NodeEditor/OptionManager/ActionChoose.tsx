import InputYaml from "components/Inputs/InputYaml";
import InputText from "components/Inputs/InputText";
import { ChooseAction } from "types/automations/actions";
import { BaseOptionManager, updateActionData } from './BaseOptionManager';


export default class ActionChooseState extends BaseOptionManager<ChooseAction> {
  defaultState = () => ({
    $smType: 'action',
    action: 'choose',
    action_data: {
      alias: "Choose",
      default: [],
      choose: [],
    }
  } as ChooseAction)
  isReady(state: ChooseAction): boolean {
    return state.action_data.alias !== ''
  }
  renderOptionList(state: ChooseAction): JSX.Element {
    const update = updateActionData(state, this.setState);
    return <div className="state-manager-options">
      <InputText
        label="Description"
        value={state.action_data.alias ?? ""}
        onChange={alias => update({ alias })}
      />
      <InputYaml
        label="Choose Sequence"
        value={state.action_data.choose}
        onChange={choose => update({ choose })}
      />
      <InputYaml
        label="Default Sequence"
        value={state.action_data.default}
        onChange={d => update({ default: d })}
      />
    </div>
  }
}
