import { AutomationTime } from "./common";

type AutomationConditionNodeBase<Name extends String, Data extends Object> = {
    condition: Name;
    alias?: string;
} & Data;
export type LogicCondition = AutomationConditionNodeBase<'and' | 'or' | 'not', {
    conditions: AutomationCondition[];
}>;
export type NumericCondition = AutomationConditionNodeBase<'numeric_state', {
    entity_id: string | string[];
    above?: string;
    below?: string;
    attribute?: string;
    value_template?: string;
}>;
export type StateCondition = AutomationConditionNodeBase<'state', {
    entity_id: string | string[];
    state: string | string[];
    for?: AutomationTime;
    attribute?: string;
}>;
export type TemplateCondition = AutomationConditionNodeBase<'template', {
    value_template: string;
}>;
export type TimeCondition = AutomationConditionNodeBase<'time', {
    after?: AutomationTime;
    before?: AutomationTime;
    weekday?: Array<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'>;
}>;
export type TriggerCondition = AutomationConditionNodeBase<'trigger', {
    id: string;
}>;
export type ZoneCondition = AutomationConditionNodeBase<'zone', {
    zone: string;
    entity_id: string | string[];
    state: string | string[];
}>;
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
