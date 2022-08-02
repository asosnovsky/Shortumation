import { OptionManager } from "./OptionManager";
import { AutomationTriggerZone } from "types/automations/triggers";
import { InputList } from "components/Inputs/InputList";
import { InputEntity } from "components/Inputs/AutoComplete/InputEntities";

export const TriggerZone: OptionManager<AutomationTriggerZone> = {
  defaultState: () => ({
    platform: "zone",
    zone: "",
    event: "enter",
    entity_id: "",
  }),
  isReady: () => true,
  renderOptionList: (state, setState) => {
    return (
      <>
        <InputEntity
          label="Zone"
          restrictToDomain={["zone"]}
          value={state.zone}
          onChange={(zone) =>
            setState({
              ...state,
              zone: zone ?? "",
            })
          }
        />
        <InputList
          label="Event"
          current={state.event}
          options={["enter", "leave"]}
          onChange={(event) =>
            setState({
              ...state,
              event,
            })
          }
        />
        <InputEntity
          multiple
          restrictToDomain={["device_tracker", "person"]}
          value={state.entity_id}
          onChange={(entity_id) =>
            setState({
              ...state,
              entity_id,
            })
          }
        />
      </>
    );
  },
};
