import InputNumber from "components/Inputs/InputNumber";
import InputText from "components/Inputs/InputText";
import InputYaml from "components/Inputs/InputYaml";
import { RepeatAction } from "types/automations/actions";
import { OptionManager, updateActionData } from './OptionManager';


export const ActionRepeatState: OptionManager<RepeatAction> = {
  defaultState: () => ({
    alias: "Repeat",
    repeat: {
      count: 1,
      sequence: [],
    }
  }),
  isReady: ({
    alias,
    repeat,
  }) => (
    alias !== '' &&
    repeat?.sequence.length > 0
  ),
  renderOptionList: (state, setState) => {
    const update = updateActionData(state, setState);
    return <>
      <InputNumber
        label="How many times?"
        value={state.repeat.count}
        onChange={(count = 1) => update({ repeat: { ...state.repeat, count } })}
      />
      <InputYaml
        label="Sequence"
        value={state.repeat.sequence ?? []}
        onChange={sequence => update({ repeat: { ...state.repeat, sequence } })}
      />
    </>
  }
}
