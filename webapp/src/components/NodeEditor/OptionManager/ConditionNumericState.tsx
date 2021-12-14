import InputText from "components/Inputs/InputText";
import { BaseOptionManager, updateConditionData } from './BaseOptionManager';
import { NumericCondition } from "types/automations/conditions";


export default class ConditionNumStateState extends BaseOptionManager<NumericCondition> {
  defaultState = () => ({
    $smType: 'condition',
    condition_data: {
      alias: "",
      entity_id: '',
      // above: '',
      // below: '',
      // attribute: '',
      value_template: '',
    },
    condition: 'numeric_state',
  } as NumericCondition)
  isReady(state: NumericCondition): boolean {
    const { alias, entity_id, value_template } = state.condition_data;
    return alias !== '' &&
      entity_id !== '' &&
      value_template !== '';
  }
  renderOptionList(state: NumericCondition): JSX.Element {
    const { alias = "", entity_id, value_template } = state.condition_data;
    return <div className="state-manager-options">
      <InputText
        label="Description"
        value={alias}
        onChange={alias => updateConditionData(this.setState)(state, {
          alias
        })}
      />
      <InputText
        textBoxFor="entity_id"
        label="Entity ID"
        value={entity_id}
        onChange={entity_id => updateConditionData(this.setState)(state, {
          entity_id
        })}
      />
      <InputText
        label="Template"
        value={value_template ?? ""}
        onChange={value_template => updateConditionData(this.setState)(state, {
          value_template
        })}
      />
    </div>
  }
}
