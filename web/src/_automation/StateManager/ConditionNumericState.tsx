import InputBoolean from "../../components/InputBoolean";
import InputYaml from "../../components/InputYaml";
import InputNumber from "../../components/InputNumber";
import InputText from "../../components/InputText";
import { BaseState } from "./BaseState";
import { NumericCondition } from "../types/condition";
import InputList from "../../components/InputList";


export default class ConditionNumStateState extends BaseState<NumericCondition> {
    defaultState = () =>  ({
        alias: "",
        condition: 'numeric_state',
        entity_id: '',
        // above: '',
        // below: '',
        // attribute: '',
        value_template: '',
    } as NumericCondition)
    isReady(state: NumericCondition): boolean {
        return state.alias !== '' &&
            state.entity_id !== '' &&
            state.value_template !== '';
    }
    renderOptionList(state: NumericCondition): JSX.Element {
        return <div className="state-manager-options">
            <InputText 
                label="Description" 
                value={state.alias ?? ""} 
                onChange={alias => this.setState({...state, alias})}
            />
            <InputText
                textBoxFor="entity_id"
                label="Entity ID" 
                value={state.entity_id} 
                onChange={entity_id => this.setState({...state, entity_id})}
            />
            <InputText
                label="Template" 
                value={state.value_template ?? ""} 
                onChange={value_template => this.setState({...state, value_template})}
            />
        </div>
    }
}