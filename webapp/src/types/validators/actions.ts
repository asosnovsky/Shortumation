import * as st from 'superstruct'
import { AutomationTime } from './common';


export const AutomationActionNodeBase = st.type({
    alias: st.optional(st.string()),
    variables: st.optional(st.record(st.string(), st.any())),
})

export const ServiceAction = st.intersection([
    AutomationActionNodeBase,
    st.type({
        data: st.any(),
        target: st.any(),
        service: st.string(),
    })
]);

export const RepeatAction = st.intersection([
    AutomationActionNodeBase,
    st.type({
        repeat: st.object({
            count: st.number(),
            sequence: st.array(st.object()),
        })
    })
]);

export const WaitAction = st.intersection([
    AutomationActionNodeBase,
    st.type({
        wait_template: st.string(),
        timeout: st.optional(AutomationTime),
        continue_on_timeout: st.optional(st.boolean()),
    })
]);

export const FireEventAction = st.intersection([
    AutomationActionNodeBase,
    st.type({
        event: st.string(),
        event_data: st.any(),
    })
]);

export const DeviceAction = st.intersection([
    AutomationActionNodeBase,
    st.type({
        type: st.string(),
        device_id: st.string(),
        entity_id: st.optional(st.string()),
        domain: st.string(),
    })
]);

export const ChooseAction = st.intersection([
    AutomationActionNodeBase,
    st.type({
        choose: st.array(st.type({
            conditions: st.array(st.object()),
            sequence: st.array(st.object()),
        })),
        default: st.optional(st.array(st.object())),
    })
]);



