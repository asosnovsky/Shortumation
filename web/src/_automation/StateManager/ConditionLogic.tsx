import InputBoolean from "../../components/InputBoolean";
import InputYaml from "../../components/InputYaml";
import InputNumber from "../../components/InputNumber";
import InputText from "../../components/InputText";
import { BaseState } from "./BaseState";
import { LogicCondition } from "../types/condition";
import InputList from "../../components/InputList";


export default class ConditionLogicState extends BaseState<LogicCondition> {
    defaultState = () =>  ({
        alias: "",
        condition: 'and',
        conditions: [],
    } as LogicCondition)
    isReady(state: LogicCondition): boolean {
        return state.alias !== '' &&
            (state?.conditions)?.length > 0
    }
    renderOptionList(state: LogicCondition): JSX.Element {
        return <div className="state-manager-options">
            <InputText 
                label="Description" 
                value={state.alias ?? ""} 
                onChange={alias => this.setState({...state, alias})}
            />
            <InputList
                label="Condition" 
                current={state.condition} 
                options={['and', 'or', 'not']}
                onChange={(condition: any) => this.setState({...state, condition})}
            />
            <InputYaml
                label="Sequence" 
                value={state.conditions} 
                onChange={conditions => this.setState({...state, conditions})}
            />
        </div>
    }
}