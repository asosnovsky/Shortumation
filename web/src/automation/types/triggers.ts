import { AutomationTime } from "./common";

export interface AutomationTriggerEvent {
    platform: 'event';
    event_type: string;
    event_data?: any;
    context?: any;
}
export interface AutomationTriggerHA {
    platform: 'homeassistant';
    event: 'start' | 'shutdown';
}
export interface AutomationTriggerMQTT {
    platform: 'mqtt';
    topic: string;
    payload: string;
    value_template: string;
}
export interface AutomationTriggerNumericState {
    platform: 'numeric_state';
    entity_id: string | string[];
    attribute?: string;
    value_template?: string;
    above?: string;
    below?: string;
    for?: AutomationTime | string;
}
export interface AutomationTriggerState {
    platform: 'state';
    entity_id: string | string[];
    attribute?: string;
    from?: string;
    to?: string;
    for?: AutomationTime | string;
}
export interface AutomationTriggerTag {
    platform: 'tag';
    tag_id: string | string[];
    device_id: string | string[];
}
export interface AutomationTriggerTemplate {
    platform: 'template';
    value_template: string;
    for?: AutomationTime | string;
}
export interface AutomationTriggerTime {
    platform: 'time';
    at: string | string[];
}
export interface AutomationTriggerTimePattern {
    platform: 'time_pattern';
    hours?: string;
    minutes?: string;
    seconds?: string;
}
export interface AutomationTriggerWebhook {
    platform: 'webhook';
    webhook_id: string;
}
export interface AutomationTriggerZone {
    platform: 'zone';
    entity_id: string;
    zone: string;
    event: 'enter' | 'leave';
}
export interface AutomationTriggerDevice {
    platform: 'device';
    device_id: string;
    domain: string;
    type: string;
    subtype: string;
}
export type AutomationTriggerGeneric = {
    platform: string;
}
export type AutomationTrigger = 
    | AutomationTriggerEvent
    | AutomationTriggerHA
    | AutomationTriggerMQTT
    | AutomationTriggerNumericState
    | AutomationTriggerState
    | AutomationTriggerTag
    | AutomationTriggerTemplate
    | AutomationTriggerTime
    | AutomationTriggerTimePattern
    | AutomationTriggerWebhook
    | AutomationTriggerZone
    | AutomationTriggerDevice
    | AutomationTriggerGeneric
;
export const triggerTypes = [
    'Event',
    'Home Assistant',
    'MQTT',
    'Numeric State',
    'State',
    'Tag',
    'Template',
    'Time',
    'Time Pattern',
    'Webhook',
    'Zone',
    'Device',
] as const;
export type TriggerType = typeof triggerTypes[number];