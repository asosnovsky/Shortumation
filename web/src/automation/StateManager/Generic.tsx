import InputWrapper from "../../components/InputWrapper";
import { ServiceScript } from "../types/script";
import { BaseState } from "./BaseState";


export default class Generic extends BaseState<{alias: string}> {
    defaultState = () =>  ({
        alias: "Unknown",
    })
    isReady(state: ServiceScript): boolean {
        return true;
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
            <br/>
            <b>THIS IS NOT SUPPORTED YET!</b>
        </div>
    }
}