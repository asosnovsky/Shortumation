import { AutomationTime } from "./common";

interface AutomationConditionNodeBase<Name extends String, Data extends Object> {
    $smType: 'condition';
    condition: Name;
    condition_data: Data & {
        alias?: string;
    };
}
export interface LogicCondition extends AutomationConditionNodeBase<'and' | 'or' | 'not', {
    conditions: AutomationCondition[];
}> { }
export interface NumericCondition extends AutomationConditionNodeBase<'numeric_state', {
    entity_id: string | string[];
    above?: string;
    below?: string;
    attribute?: string;
    value_template?: string;
}> { }
export interface StateCondition extends AutomationConditionNodeBase<'state', {
    entity_id: string | string[];
    state: string | string[];
    for?: AutomationTime;
    attribute?: string;
}> { }
export interface TemplateCondition extends AutomationConditionNodeBase<'template', {
    value_template: string;
}> { }
export interface TimeCondition extends AutomationConditionNodeBase<'time', {
    after?: AutomationTime;
    before?: AutomationTime;
    weekday?: Array<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'>;
}> { }
export interface TriggerCondition extends AutomationConditionNodeBase<'trigger', {
    id: string;
}> { }
export interface ZoneCondition extends AutomationConditionNodeBase<'zone', {
    zone: string;
    entity_id: string | string[];
    state: string | string[];
}> { }
export type AutomationCondition =
    | LogicCondition
    | NumericCondition
    | StateCondition
    | TemplateCondition
    | TimeCondition
    | TriggerCondition
    | ZoneCondition
    ;
export type ConditionType = AutomationCondition['condition'];
