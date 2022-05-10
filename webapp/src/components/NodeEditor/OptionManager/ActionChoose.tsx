import InputText from "components/Inputs/InputText";
import { ChooseAction } from "types/automations/actions";
import { OptionManager, updateActionData } from './OptionManager';


export const ActionChooseState: OptionManager<ChooseAction> = {
  defaultState: () => ({
    alias: "",
    default: [],
    choose: [],
  }),
  isReady: ({ alias }) => {
    return alias !== ''
  },
  renderOptionList: (state, setState) => {
    const update = updateActionData(state, setState);
    return <>
      <InputText
        label="Description"
        value={state.alias ?? ""}
        onChange={alias => update({ alias })}
      />
    </>
  }
}
