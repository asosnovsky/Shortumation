import * as st from 'superstruct'
import { AutomationTime, EntityId } from './common';


export const AutomationConditionNodeBase = st.type({});
export const LogicCondition = st.intersection([
    AutomationConditionNodeBase,
    st.type({
        condition: st.enums(['and', 'or', 'not']),
        conditions: st.array(st.object())
    })
])
export const NumericCondition = st.intersection([
    AutomationConditionNodeBase,
    st.type({
        condition: st.literal('numeric_state'),
        entity_id: EntityId,
        above: st.optional(st.string()),
        below: st.optional(st.string()),
        attribute: st.optional(st.string()),
        value_template: st.optional(st.string()),
    })
]);
export const StateCondition = st.intersection([
    AutomationConditionNodeBase,
    st.type({
        condition: st.literal('state'),
        entity_id: EntityId,
        state: st.union([st.array(st.string()), st.string()]),
        for: st.optional(AutomationTime),
        attribute: st.optional(st.string()),
    })
]);
export const TemplateCondition = st.intersection([
    AutomationConditionNodeBase,
    st.type({
        condition: st.literal('template'),
        value_template: st.string(),
    })
]);
export const TriggerCondition = st.intersection([
    AutomationConditionNodeBase,
    st.type({
        condition: st.literal('trigger'),
        id: st.string(),
    })
]);
export const TimeCondition = st.intersection([
    AutomationConditionNodeBase,
    st.type({
        condition: st.literal('time'),
        after: st.optional(AutomationTime),
        before: st.optional(AutomationTime),
        weekday: st.optional(st.enums([
            'mon', 'tue', 'wed',
            'thu', 'fri', 'sat',
            'sun',
        ]))
    })
]);
export const ZoneCondition = st.intersection([
    AutomationConditionNodeBase,
    st.type({
        condition: st.literal('zone'),
        zone: st.string(),
        entity_id: EntityId,
        state: st.union([st.array(st.string()), st.string()]),
    })
]);