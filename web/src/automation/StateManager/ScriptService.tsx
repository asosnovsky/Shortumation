import InputText from "../../components/InputText";
import InputWrapper from "../../components/InputWrapper";
import { ServiceScript } from "../types/script";
import { BaseState } from "./BaseState";


export default class ScriptCallServiceState extends BaseState<ServiceScript> {
    defaultState = () =>  ({
        service: "",
        alias: "Call Service",
        target: "",
        data: {},
    })
    isReady(state: ServiceScript): boolean {
        return state.service !== '' &&
            state.alias !== '' &&
            state.target !== ''
    }
    renderOptionList(state: ServiceScript): JSX.Element {
        return <div className="state-manager-options">
            <InputText 
                label="Description" 
                value={state.alias} 
                onChange={alias => this.setState({...state, alias})}
            />
            <InputText 
                textBoxFor="service"
                label="Service" 
                value={state.service} 
                onChange={service => this.setState({...state, service})}
            />
            <InputText 
                label="Target" 
                value={state.target} 
                onChange={target => this.setState({...state, target})}
            />
        </div>
    }
}