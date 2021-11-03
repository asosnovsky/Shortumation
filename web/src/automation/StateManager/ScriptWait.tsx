import InputBoolean from "../../components/InputBoolean";
import InputNumber from "../../components/InputNumber";
import InputText from "../../components/InputText";
import { WaitScript } from "../types/script";
import { BaseState } from "./BaseState";


export default class ScriptWaitState extends BaseState<WaitScript> {
    defaultState = () =>  ({
        alias: "Wait",
        wait_template: "",
        timeout: 0,
        continue_on_timeout: false,
    })
    isReady(state: WaitScript): boolean {
        return state.alias !== '' &&
            state.wait_template !== ""
    }
    renderOptionList(state: WaitScript): JSX.Element {
        return <div className="state-manager-options">
            <InputText 
                label="Description" 
                value={state.alias} 
                onChange={alias => this.setState({...state, alias})}
            />
            <InputText
                textBoxFor="template" 
                label="Template" 
                value={state.wait_template} 
                onChange={wait_template => this.setState({...state, wait_template})}
            />
            <InputNumber 
                label="Timeout" 
                value={state.timeout ?? 0} 
                onChange={timeout => this.setState({...state, timeout})}
            />
            <InputBoolean 
                label="Continue on Timeout" 
                value={state.continue_on_timeout ?? false} 
                onChange={continue_on_timeout => this.setState({...state, continue_on_timeout})}
            />
        </div>
    }
}