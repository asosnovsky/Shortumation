import { OptionManager } from "./OptionManager";
import { AutomationTriggerSun } from "types/automations/triggers";
import { InputList } from "components/Inputs/InputList";
import InputText from "components/Inputs/Base/InputText";

export const TriggerSunState: OptionManager<AutomationTriggerSun> = {
  defaultState: (): AutomationTriggerSun => ({
    platform: "sun",
    event: "sunset",
  }),
  isReady: () => true,
  Component: ({ state, setState }) => {
    return (
      <>
        <InputList
          label="Event Type"
          current={state.event}
          options={["sunset", "sunrise"]}
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
