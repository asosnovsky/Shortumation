import { AutomationSequenceNode } from ".";
import { AutomationTime } from "./common";
import { AutomationCondition } from "./conditions";

interface AutomationActionNodeBase<Name extends String,Data extends Object> {
    $smType: 'action';
    action: Name;
    action_data: Data & {
        alias?: string;
        variables?: Record<string, any>;
    };
}

export interface ServiceAction extends AutomationActionNodeBase<"service", {
    service: string;
    target: any;
    data: any;
}>{}
export interface RepeatAction extends AutomationActionNodeBase<"repeat", {
    repeat: {
        count: number;
        sequence: AutomationAction[];
    }
}>{}
export interface WaitAction extends AutomationActionNodeBase<"wait", {
    wait_template: string;
    timeout?: AutomationTime;
    continue_on_timeout?: boolean;
}>{}
export interface FireEventAction extends AutomationActionNodeBase<"event", {
    event: string;
    event_data: any;
}>{}
export interface DeviceAction extends AutomationActionNodeBase<"device", {
    type: string;
    device_id: string;
    entity_id?: string;
    domain: string;
}>{}
export interface ChooseAction extends AutomationActionNodeBase<"choose", {
    choose: Array<{
        conditions: AutomationCondition[];
        sequence: AutomationSequenceNode[];
    }>;
    default: AutomationSequenceNode[];
}>{}
export type AutomationAction = 
    | ServiceAction
    | RepeatAction
    | WaitAction
    | FireEventAction
    | DeviceAction
    | ChooseAction
;
export const ActionTypes = [
    'Service',
    'Repeat',
    'Wait',
    'Event',
    'Device',
    'Choose'
] as const;
export type ActionType = typeof ActionTypes[number];
