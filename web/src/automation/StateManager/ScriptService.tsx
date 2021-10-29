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
            <InputWrapper label="Description">
                <input value={state.alias} onChange={e => {
                    e.preventDefault();
                    this.setState({
                        ...state,
                        alias: e.target.value,
                    })
                }}/>
            </InputWrapper>
            <InputWrapper label="Service">
                <input value={state.service} onChange={e => {
                    e.preventDefault();
                    this.setState({
                        ...state,
                        service: e.target.value,
                    })
                }}/>
            </InputWrapper>
            <InputWrapper label="Target">
                <input value={state.target} onChange={e => {
                    e.preventDefault();
                    this.setState({
                        ...state,
                        target: e.target.value,
                    })
                }}/>
            </InputWrapper>
        </div>
    }
}