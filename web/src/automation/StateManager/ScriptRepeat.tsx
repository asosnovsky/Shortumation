import InputNumber from "../../components/InputNumber";
import InputText from "../../components/InputText";
import { RepeatScript } from "../types/script";
import { BaseState } from "./BaseState";


export default class ScriptRepeatState extends BaseState<RepeatScript> {
    defaultState = () =>  ({
        alias: "Repeat",
        repeat: {
            count: 1,
            sequence: [],
        }
    })
    isReady(state: RepeatScript): boolean {
        return state.alias !== '' &&
            state?.repeat?.sequence.length > 0
    }
    renderOptionList(state: RepeatScript): JSX.Element {
        return <div className="state-manager-options">
            <InputText 
                label="Description" 
                value={state.alias} 
                onChange={alias => this.setState({...state, alias})}
            />
            <InputNumber 
                label="How many times?" 
                value={state?.repeat?.count} 
                onChange={count => this.setState({...state, repeat: {...state.repeat, count}})}
            />
            <div>
                {JSON.stringify(state?.repeat?.sequence)}
            </div>
        </div>
    }
}