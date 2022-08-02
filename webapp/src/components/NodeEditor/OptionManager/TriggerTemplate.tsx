import { OptionManager } from "./OptionManager";
import { AutomationTriggerTemplate } from "types/automations/triggers";
import InputText from "components/Inputs/Base/InputText";
import { InputTime } from "components/Inputs/Base/InputTime";

export const TriggerTemplate: OptionManager<AutomationTriggerTemplate> = {
  defaultState: () => ({
    platform: "template",
    value_template: "",
  }),
  isReady: () => true,
  renderOptionList: (state, setState) => {
    return (
      <>
        <InputText
          label="Template"
          value={state.value_template}
          onChange={(value_template) => setState({ ...state, value_template })}
        />
        <InputTime
          label="For"
          value={state.for}
          onChange={(_for) =>
            setState({
              ...state,
              for: _for,
            })
          }
        />
      </>
    );
  },
};
