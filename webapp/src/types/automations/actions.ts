import { AutomationSequenceNode } from ".";
import { AutomationTime } from "./common";
import { AutomationCondition } from "./conditions";

type AutomationActionNodeBase<Data extends Object> = Data & {
    alias?: string;
    variables?: Record<string, any>;
}

export type ServiceAction = AutomationActionNodeBase<{
    service: string;
    target?: any;
    data: any;
}>
export type RepeatAction = AutomationActionNodeBase<{
    repeat: {
        count: number;
        sequence: AutomationAction[];
    }
}>
export type WaitAction = AutomationActionNodeBase<{
    wait_template: string;
    timeout?: AutomationTime;
    continue_on_timeout?: boolean;
}>
export type FireEventAction = AutomationActionNodeBase<{
    event: string;
    event_data: any;
}>
export type DeviceAction = AutomationActionNodeBase<{
    type: string;
    device_id: string;
    entity_id?: string;
    domain: string;
}>
export type ChooseAction = AutomationActionNodeBase<{
    choose: Array<{
        conditions: AutomationCondition[];
        sequence: AutomationSequenceNode[];
    }>;
    default?: AutomationSequenceNode[];
}>
export type AutomationAction =
    | ServiceAction
    | RepeatAction
    | WaitAction
    | FireEventAction
    | DeviceAction
    | ChooseAction
    ;
export type ActionType =
    | 'service'
    | 'repeat'
    | 'wait'
    | 'event'
    | 'device'
    | 'choose'
    ;
