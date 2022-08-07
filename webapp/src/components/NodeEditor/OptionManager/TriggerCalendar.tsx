import { OptionManager } from "./OptionManager";
import { AutomationTriggerCalendar } from "types/automations/triggers";
import { InputList } from "components/Inputs/InputList";
import InputText from "components/Inputs/Base/InputText";

export const TriggerCalendarState: OptionManager<AutomationTriggerCalendar> = {
  defaultState: (): AutomationTriggerCalendar => ({
    platform: "calendar",
    event: "sunset",
  }),
  isReady: () => true,
  Component: ({ state, setState }) => {
    return (
      <>
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
