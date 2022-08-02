import { OptionManager } from "./OptionManager";
import { AutomationTriggerWebhook } from "types/automations/triggers";
import InputText from "components/Inputs/Base/InputText";

export const TriggerWebhook: OptionManager<AutomationTriggerWebhook> = {
  defaultState: () => ({
    platform: "webhook",
    webhook_id: "",
  }),
  isReady: () => true,
  renderOptionList: (state, setState) => {
    return (
      <>
        <InputText
          label="Webhook ID"
          value={state.webhook_id ?? ""}
          onChange={(webhook_id) =>
            setState({
              ...state,
              webhook_id,
            })
          }
        />
      </>
    );
  },
};
