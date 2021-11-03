import InputBoolean from "../../components/InputBoolean";
import InputYaml from "../../components/InputYaml";
import InputNumber from "../../components/InputNumber";
import InputText from "../../components/InputText";
import { ChooseScript } from "../types/script";
import { BaseState } from "./BaseState";


export default class ScriptChooseState extends BaseState<ChooseScript> {
    defaultState = () =>  ({
        alias: "Choose",
        default: [],
        choose: [],
    })
    isReady(state: ChooseScript): boolean {
        return state.alias !== ''
    }
    renderOptionList(state: ChooseScript): JSX.Element {
        return <div className="state-manager-options">
            <InputText 
                label="Description" 
                value={state.alias} 
                onChange={alias => this.setState({...state, alias})}
            />
            <InputYaml
                label="Choose Sequence" 
                value={state.choose} 
                onChange={choose => this.setState({...state, choose})}
            />
            <InputYaml
                label="Default Sequence" 
                value={state.default} 
                onChange={d => this.setState({...state, default: d})}
            />
        </div>
    }
}