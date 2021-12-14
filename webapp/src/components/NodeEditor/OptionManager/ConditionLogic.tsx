import InputYaml from "components/Inputs/InputYaml";
import InputText from "components/Inputs/InputText";
import { BaseOptionManager } from "./BaseOptionManager";
import { LogicCondition } from "types/automations/conditions";
import InputList from "components/Inputs/InputList";


export default class ConditionLogicState extends BaseOptionManager<LogicCondition> {
  defaultState = () => ({
    $smType: 'condition',
    condition: 'and',
    condition_data: {
      alias: "",
      conditions: [],
    }
  } as LogicCondition)
  isReady(state: LogicCondition): boolean {
    const { alias, conditions } = state.condition_data;
    return alias !== '' &&
      conditions?.length > 0;
  }
  renderOptionList(state: LogicCondition): JSX.Element {
    const { alias = "", conditions } = state.condition_data;
    return <div className="state-manager-options">
      <InputText
        label="Description"
        value={alias}
        onChange={a => this.setState({
          ...state, condition_data: {
            alias: a, conditions
          }
        })}
      />
      <InputList
        label="Condition"
        current={state.condition}
        options={['and', 'or', 'not']}
        onChange={(condition: any) => this.setState({ ...state, condition })}
      />
      <InputYaml
        label="Sequence"
        value={conditions}
        onChange={c => this.setState({
          ...state, condition_data: {
            alias, conditions: c
          }
        })}
      />
    </div>
  }
}
