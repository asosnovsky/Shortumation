import { OptionManager } from "./OptionManager";
import { AutomationTriggerCalendar } from "types/automations/triggers";
import { InputList } from "components/Inputs/InputList";
import InputText from "components/Inputs/Base/InputText";
import { InputEntity } from "components/Inputs/AutoComplete/InputEntities";

export const TriggerCalendarState: OptionManager<AutomationTriggerCalendar> = {
  defaultState: (): AutomationTriggerCalendar => ({
    platform: "calendar",
    event: "sunset",
  }),
  isReady: () => true,
  Component: ({ state, setState }) => {
    return (
      <>
        <InputEntity
          label="Calendar"
          restrictToDomain={["calendar"]}
          value={state.entity_id ?? ""}
          onChange={(v) => setState({ ...state, entity_id: v ?? "" })}
        />
        <InputList
          label="Event Type"
          current={state.event}
          options={["start", "end"]}
          onChange={(event) =>
            setState({
              ...state,
              event,
            })
          }
        />
        <InputText
          label="Offset"
          value={state.offset ?? ""}
          onChange={(s) =>
            setState({
              ...state,
              offset: !s ? undefined : s,
            })
          }
        />
      </>
    );
  },
};
