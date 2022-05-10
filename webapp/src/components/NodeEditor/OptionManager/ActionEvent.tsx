import InputYaml from "components/Inputs/InputYaml";
import InputText from "components/Inputs/InputText";
import { FireEventAction } from "types/automations/actions";
import { OptionManager, updateActionData } from "./OptionManager";


export const ActionEventState: OptionManager<FireEventAction> = {
  defaultState: () => ({
    alias: "Fire Event",
    event: "",
    event_data: {},
  }),
  isReady: ({ alias, event }) => (
    alias !== '' &&
    event !== ""
  ),
  renderOptionList: (state, setState) => {
    const update = updateActionData(state, setState);
    return <>
      <InputText
        label="Description"
        value={state.alias ?? ""}
        onChange={alias => update({ alias })}
      />
      <InputText
        textBoxFor="event"
        label="Event"
        value={state.event}
        onChange={event => update({ event })}
      />
      <InputYaml
        label="Event Data"
        value={state.event_data}
        onChange={event_data => update({ event_data })}
      />
    </>
  }
}
