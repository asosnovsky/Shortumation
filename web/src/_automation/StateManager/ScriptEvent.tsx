import InputBoolean from "../../components/InputBoolean";
import InputYaml from "../../components/InputYaml";
import InputNumber from "../../components/InputNumber";
import InputText from "../../components/InputText";
import { FireEventScript } from "../types/script";
import { BaseState } from "./BaseState";


export default class ScriptEventState extends BaseState<FireEventScript> {
    defaultState = () =>  ({
        alias: "Fire Event",
        event: "",
        event_data: {},
    })
    isReady(state: FireEventScript): boolean {
        return state.alias !== '' &&
            state.event !== ""
    }
    renderOptionList(state: FireEventScript): JSX.Element {
        return <div className="state-manager-options">
            <InputText 
                label="Description" 
                value={state.alias ?? ""} 
                onChange={alias => this.setState({...state, alias})}
            />
            <InputText
                textBoxFor="event" 
                label="Event" 
                value={state.event} 
                onChange={event => this.setState({...state, event})}
            />
            <InputYaml 
                label="Event Data" 
                value={state.event_data} 
                onChange={event_data => this.setState({...state, event_data})}
            />
        </div>
    }
}