import InputYaml from "components/Inputs/InputYaml";
import InputText from "components/Inputs/InputText";
import { FireEventAction } from "types/automations/actions";
import { OptionManager, updateActionData } from "./OptionManager";


export const ActionEventState: OptionManager<FireEventAction> = {
  defaultState: () => ({
    $smType: "action",
    action: 'event',
    action_data: {
      alias: "Fire Event",
      event: "",
      event_data: {},
    }
  }),
  isReady: ({ action_data: { alias, event } }) => (
    alias !== '' &&
    event !== ""
  ),
  renderOptionList: (state, setState) => {
    const update = updateActionData(state, setState);
    return <div className="state-manager-options">
      <InputText
        label="Description"
        value={state.action_data.alias ?? ""}
        onChange={alias => update({ alias })}
      />
      <InputText
        textBoxFor="event"
        label="Event"
        value={state.action_data.event}
        onChange={event => update({ event })}
      />
      <InputYaml
        label="Event Data"
        value={state.action_data.event_data}
        onChange={event_data => update({ event_data })}
      />
    </div>
  }
}
