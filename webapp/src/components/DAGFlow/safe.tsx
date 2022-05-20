import "./safe.css";
import { Component, ErrorInfo } from "react";
import { DAGAutomationFlow, DAGAutomationFlowProps } from ".";
import { AutomationSequenceNode } from "types/automations";
import { AutomationCondition } from "types/automations/conditions";
import { AutomationTrigger } from 'types/automations/triggers';
import InputYaml from "components/Inputs/InputYaml";
import { Button } from "components/Inputs/Button";

type GoodState = {
    hasError: false;
}
type FailedStateData = {
    sequence: AutomationSequenceNode[],
    condition: AutomationCondition[],
    trigger: AutomationTrigger[],
}
type FailedState = {
    hasError: true,
    error: any,
    errorInfo?: ErrorInfo,
} & FailedStateData
type State = GoodState | FailedState
export class SafeDAGAutomationFlow extends Component<DAGAutomationFlowProps, State> {

    state: State = {
        hasError: false
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            hasError: true,
            error,
            errorInfo,
            sequence: this.props.sequence,
            condition: this.props.condition,
            trigger: this.props.trigger,
        })
    }

    render() {
        if (this.state.hasError) {
            const makeSet = <K extends keyof FailedStateData>(k: K) => (d: FailedStateData[K]) => this.setState({
                ...this.state,
                [k]: d,
            });
            const makeSave = <K extends keyof FailedStateData>(k: K) => () => {
                if (!this.state.hasError) {
                    return
                }
                if (k === 'condition') {
                    this.props.onConditionUpdate(this.state.condition)
                } else if (k === 'sequence') {
                    this.props.onSequenceUpdate(this.state.sequence)
                } else if (k === 'trigger') {
                    this.props.onTriggerUpdate(this.state.trigger)
                }
            }
            return <div className="dag-flow-safe">
                <h1>An Error has occured.</h1>

                <h1>Failed to Open Autmation!</h1>
                Something is likely not configured in your automation properly.
                <hr />
                <h2>Error:</h2>
                <h2>{String(this.state.error)}</h2>
                <br />
                {JSON.stringify(this.state.error, null, 4)}
                {this.state.errorInfo && this.state.errorInfo.componentStack.split('\n').map((s, i) => <>
                    <span key={i}>{s}</span><br key={`br-${i}`} />
                </>)}
                <h2>Automation YAML</h2>
                <InputYaml label="Trigger" value={this.state.trigger} onChange={makeSet('trigger')} />
                <Button onClick={makeSave('trigger')}>Save Triggers</Button>
                <InputYaml label="Condition" value={this.state.condition} onChange={makeSet('condition')} />
                <Button onClick={makeSave('condition')}>Save Conditions</Button>
                <InputYaml label="Action" value={this.state.sequence} onChange={makeSet('sequence')} />
                <Button onClick={makeSave('sequence')}>Save Actions</Button>
            </div>
        }

        return <DAGAutomationFlow {...this.props} />;
    }
}