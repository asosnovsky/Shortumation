import { AutomationTime } from "./common";

interface AutomationTriggerBase {
  alias?: string;
  $smType: undefined | 'trigger';
}

export interface AutomationTriggerEvent extends AutomationTriggerBase {
    platform: 'event';
    event_type: string | string[];
    event_data?: any;
    context?: any;
}
export interface AutomationTriggerHA extends AutomationTriggerBase {
    platform: 'homeassistant';
    event: 'start' | 'shutdown';
}
export interface AutomationTriggerMQTT extends AutomationTriggerBase {
    platform: 'mqtt';
    topic: string;
    payload: string;
    value_template: string;
}
export interface AutomationTriggerNumericState extends AutomationTriggerBase {
    platform: 'numeric_state';
    entity_id: string | string[];
    attribute?: string;
    value_template?: string;
    above?: string;
    below?: string;
    for?: AutomationTime;
}
export interface AutomationTriggerState extends AutomationTriggerBase {
    platform: 'state';
    entity_id: string | string[];
    attribute?: string;
    from?: string | string[];
    to?: string | string[];
    for?: AutomationTime;
}
export interface AutomationTriggerTag extends AutomationTriggerBase {
    platform: 'tag';
    tag_id: string | string[];
    device_id: string | string[];
}
export interface AutomationTriggerTemplate extends AutomationTriggerBase {
    platform: 'template';
    value_template: string;
    for?: AutomationTime;
}
export interface AutomationTriggerTime extends AutomationTriggerBase {
    platform: 'time';
    at: string | string[];
}
export interface AutomationTriggerTimePattern extends AutomationTriggerBase {
    platform: 'time_pattern';
    hours?: string;
    minutes?: string;
    seconds?: string;
}
export interface AutomationTriggerWebhook extends AutomationTriggerBase {
    platform: 'webhook';
    webhook_id: string;
}
export interface AutomationTriggerZone extends AutomationTriggerBase {
    platform: 'zone';
    entity_id: string;
    zone: string;
    event: 'enter' | 'leave';
}
export interface AutomationTriggerDevice extends AutomationTriggerBase {
    platform: 'device';
    device_id: string;
    domain: string;
    type: string;
    subtype: string;
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
;
export type TriggerType = AutomationTrigger['platform'];
