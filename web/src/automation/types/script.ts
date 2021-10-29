import { AutomationCondition } from "./condition";

interface BaseScript {
    alias: string;
    variables?: Record<string, any>;
}

export interface ServiceScript extends BaseScript {
    service: string;
    target: any;
    data: any;
}
export interface RepeatScript extends BaseScript {
    repeat: {
        count: number;
        sequence: AutomationScript[];
    }
}
export interface WaitScript extends BaseScript {
    wait_template: string;
    timeout?: number;
    continue_on_timeout?: boolean;
}
export interface FireEventScript extends BaseScript {
    event: string;
    event_data: any;
}
export interface DeviceScript extends BaseScript {
    type: string;
    device_id: string;
    entity_id: string;
    domain: string;
}
export interface ChooseScript extends BaseScript {
    choose: Array<{
        conditions: AutomationCondition[];
        sequence: AutomationScript[];
    }>;
    default: AutomationScript[];
}
export type AutomationScript = 
    | ServiceScript
    | RepeatScript
    | WaitScript
    | FireEventScript
    | DeviceScript
    | ChooseScript
;
export const scriptTypes = [
    'Service',
    'Repeat',
    'Wait',
    'Event',
    'Device',
    'Choose'
] as const;
export type ScriptType = typeof scriptTypes[number];