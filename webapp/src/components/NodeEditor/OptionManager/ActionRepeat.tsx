import InputNumber from "components/Inputs/InputNumber";
import InputText from "components/Inputs/InputText";
import InputYaml from "components/Inputs/InputYaml";
import { RepeatAction } from "types/automations/actions";
import { OptionManager, updateActionData } from './OptionManager';


export const ActionRepeatState: OptionManager<RepeatAction> = {
  defaultState: () => ({
    $smType: 'action',
    action: 'repeat',
    action_data: {
      alias: "Repeat",
      repeat: {
        count: 1,
        sequence: [],
      }
    }
  }),
  isReady: ({ action_data: {
    alias,
    repeat,
  } }) => (
    alias !== '' &&
    repeat?.sequence.length > 0
  ),
  renderOptionList: (state, setState) => {
    const update = updateActionData(state, setState);
    return <>
      <InputText
        label="Description"
        value={state.action_data.alias ?? ""}
        onChange={alias => update({ alias })}
      />
      <InputNumber
        label="How many times?"
        value={state.action_data.repeat.count}
        onChange={(count = 1) => update({ repeat: { ...state.action_data.repeat, count } })}
      />
      <InputYaml
        label="Sequence"
        value={state.action_data.repeat.sequence ?? []}
        onChange={sequence => update({ repeat: { ...state.action_data.repeat, sequence } })}
      />
    </>
  }
}
