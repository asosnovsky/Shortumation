import { AutomationTime } from "./common";
import * as st from 'superstruct';
import * as v from "types/validators/conditions";
type AutomationConditionNodeBase<Name extends String, Data extends Object> = {
    condition: Name;
    enabled?: boolean;
} & Data;
export type LogicCondition = AutomationConditionNodeBase<'and' | 'or' | 'not', {
    conditions: AutomationCondition[];
}>;
export type NumericCondition = st.Infer<typeof v.NumericCondition>;
export type StateCondition = st.Infer<typeof v.StateCondition>;
export type TemplateCondition = st.Infer<typeof v.TemplateCondition>;
export type TimeCondition = st.Infer<typeof v.TimeCondition>;
export type TriggerCondition = st.Infer<typeof v.TriggerCondition>;
export type ZoneCondition = st.Infer<typeof v.ZoneCondition>;
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
