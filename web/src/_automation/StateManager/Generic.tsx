import InputText from "../../components/InputText";
import { BaseState } from "./BaseState";


export default class Generic extends BaseState<{alias: string}> {
    defaultState = () =>  ({
        alias: "Unknown",
    })
    isReady(state: any): boolean {
        return true;
    }
    renderOptionList(state: any): JSX.Element {
        return <div className="state-manager-options">
            <InputText label="Description" 
                value={state.alias??""} 
                onChange={alias => this.setState({...state, alias})}
            />
            <br/>
            <b>THIS IS NOT SUPPORTED YET!</b>
        </div>
    }
}