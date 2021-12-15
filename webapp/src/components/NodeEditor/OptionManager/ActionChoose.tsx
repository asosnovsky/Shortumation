import InputYaml from "components/Inputs/InputYaml";
import InputText from "components/Inputs/InputText";
import { ChooseAction } from "types/automations/actions";
import { OptionManager, updateActionData } from './OptionManager';


export const ActionChooseState: OptionManager<ChooseAction> = {
  defaultState: () => ({
    $smType: 'action',
    action: 'choose',
    action_data: {
      alias: "Choose",
      default: [],
      choose: [],
    }
  }),
  isReady: ({ action_data: { alias } }) => {
    return alias !== ''
  },
  renderOptionList: (state, setState) => {
    const update = updateActionData(state, setState);
    return <>
      <InputText
        label="Description"
        value={state.action_data.alias ?? ""}
        onChange={alias => update({ alias })}
      />
      <InputYaml
        label="Choose Sequence"
        value={state.action_data.choose}
        onChange={choose => update({ choose })}
        resizable
      />
      <InputYaml
        label="Default Sequence"
        value={state.action_data.default}
        onChange={d => update({ default: d })}
        resizable
      />
    </>
  }
}
