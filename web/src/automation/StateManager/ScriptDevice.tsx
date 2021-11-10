import InputBoolean from "../../components/InputBoolean";
import InputYaml from "../../components/InputYaml";
import InputNumber from "../../components/InputNumber";
import InputText from "../../components/InputText";
import { DeviceScript } from "../types/script";
import { BaseState } from "./BaseState";


export default class ScriptDeviceState extends BaseState<DeviceScript> {
    defaultState = () =>  ({
        alias: "Device",
        type: "",
        entity_id: "",
        device_id: "",
        domain: "",
    })
    isReady(state: DeviceScript): boolean {
        return state.alias !== '' &&
            state.type !== "" &&
            state.entity_id !== "" &&
            state.device_id !== "" &&
            state.domain !== ""
    }
    renderOptionList(state: DeviceScript): JSX.Element {
        return <div className="state-manager-options">
            <InputText 
                label="Description" 
                value={state.alias ?? ""} 
                onChange={alias => this.setState({...state, alias})}
            />
            <InputText
                textBoxFor="device_id" 
                label="Device" 
                value={state.device_id} 
                onChange={device_id => this.setState({...state, device_id})}
            />
            <InputText
                textBoxFor="type" 
                label="Action" 
                value={state.type} 
                onChange={type => this.setState({...state, type})}
            />
            <InputText
                textBoxFor="entity_id" 
                label="Entity ID" 
                value={state.entity_id ?? ""} 
                onChange={entity_id => this.setState({...state, entity_id, domain: entity_id.split('.')[0]})}
            />
        </div>
    }
}