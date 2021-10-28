import { ServiceScript } from "../types/script";
import { BaseStateManager } from "./BaseManager";


export class ScriptCallService extends BaseStateManager<ServiceScript> {
    defaultState(): ServiceScript {
        return {
            service: "",
            alias: "Call Service",
            target: "",
            data: {},
        }
    }
    isReady(): boolean {
        return this.state.service !== '' &&
            this.state.alias !== '' &&
            this.state.target !== ''
    }
    renderOptionList(): JSX.Element {
        return <div className="state-manager-options">
            <label htmlFor="#alias">Description</label>
            <input id="alias" value={this.state.alias} onChange={e => {
                e.preventDefault();
                this.setState({
                    ...this.state,
                    alias: e.target.value,
                })
            }}/>
            <label htmlFor="#service">Service</label>
            <input id="service" value={this.state.service} onChange={e => {
                e.preventDefault();
                this.setState({
                    ...this.state,
                    service: e.target.value,
                })
            }}/>
            <label htmlFor="#target">Target</label>
            <input id="target" value={this.state.target} onChange={e => {
                e.preventDefault();
                this.setState({
                    ...this.state,
                    target: e.target.value,
                })
            }}/>
        </div>
    }
}