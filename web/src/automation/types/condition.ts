import { AutomationTime } from "./common";

interface BaseCondition {
    alias: string;
};
export interface LogicCondition extends BaseCondition {
    condition: 'and' | 'or' | 'not';
    conditions: AutomationCondition[];
}
export interface NumericCondition extends BaseCondition {
    condition: 'numeric_state';
    entity_id: string;
    above?: string;
    below?: string;
    attribute?: string;
    value_template?: string;
}
export interface StateCondition extends BaseCondition {
    condition: 'state';
    entity_id: string | string[];
    state: string | string[];
    for?: AutomationTime | string;
    attribute?: string;
}
export interface TemplateCondition extends BaseCondition {
    condition: 'template';
    value_template: string;
}
export interface TimeCondition extends BaseCondition {
    condition: 'time';
    after?: string;
    before?: string;
    weekday?: Array<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'>;
}
export interface TriggerCondition extends BaseCondition {
    condition: 'trigger';
    id: string | string[];
}
export interface ZoneCondition extends BaseCondition {
    condition: 'zone';
    zone: string;
    entity_id: string | string[];
    state: string | string[];
}
export interface GenericCondition extends BaseCondition {
    condition: string;
}
export type AutomationCondition = 
    | LogicCondition
    | NumericCondition
    | StateCondition
    | TemplateCondition
    | TimeCondition
    | TriggerCondition
    | ZoneCondition
    | GenericCondition
;
export const conditionTypes = [
    'Logic',
    'Numeric State',
    'State',
    'Template',
    'Time',
    'Trigger',
    'Zone',
    'Generic',
] as const;
export type ConditionType = typeof conditionTypes[number];