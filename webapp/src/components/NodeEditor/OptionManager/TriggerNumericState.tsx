import { OptionManager } from "./OptionManager";
import { AutomationTriggerNumericState } from "types/automations/triggers";
import InputText from "components/Inputs/Base/InputText";
import { InputEntity } from "components/Inputs/AutoComplete/InputEntities";
import InputNumber from "components/Inputs/Base/InputNumber";
import { InputTime } from "components/Inputs/Base/InputTime";
import InputYaml from "components/Inputs/Base/InputYaml";

export const TriggerNumericState: OptionManager<AutomationTriggerNumericState> =
  {
    defaultState: () => ({
      platform: "numeric_state",
      entity_id: "",
    }),
    isReady: () => true,
    renderOptionList: (state, setState) => {
      return (
        <>
          <InputEntity
            value={state.entity_id}
            multiple
            onChange={(entity_id) =>
              setState({
                ...state,
                entity_id,
              })
            }
          />
          <InputText
            label="Attribute"
            value={state.attribute ?? ""}
            onChange={(attribute) =>
              setState({
                ...state,
                attribute,
              })
            }
          />
          <InputNumber
            label="Above"
            value={state.above ? Number(state.above) : undefined}
            onChange={(above) =>
              setState({
                ...state,
                above: above ? String(above) : undefined,
              })
            }
          />
          <InputNumber
            label="Below"
            value={state.below ? Number(state.below) : undefined}
            onChange={(below) =>
              setState({
                ...state,
                below: below ? String(below) : undefined,
              })
            }
          />
          <InputYaml
            label="Template"
            value={state.value_template ?? ""}
            onChange={(value_template) =>
              setState({
                ...state,
                value_template,
              })
            }
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
