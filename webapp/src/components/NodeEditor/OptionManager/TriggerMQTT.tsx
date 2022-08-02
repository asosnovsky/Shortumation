import { OptionManager } from "./OptionManager";
import { AutomationTriggerMQTT } from "types/automations/triggers";
import InputText from "components/Inputs/Base/InputText";

export const TriggerMQTTState: OptionManager<AutomationTriggerMQTT> = {
  defaultState: () => ({
    platform: "mqtt",
    payload: "",
    topic: "",
    value_template: "",
  }),
  isReady: () => true,
  renderOptionList: (state, setState) => {
    return (
      <>
        <InputText
          label="Payload"
          value={state.payload}
          onChange={(payload) => setState({ ...state, payload })}
        />
        <InputText
          label="Topic"
          value={state.topic}
          onChange={(topic) => setState({ ...state, topic })}
        />
        <InputText
          label="Template"
          value={state.value_template}
          onChange={(value_template) => setState({ ...state, value_template })}
        />
      </>
    );
  },
};
