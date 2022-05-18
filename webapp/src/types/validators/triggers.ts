import * as st from 'superstruct'
import { AutomationTime } from './common'


const AutomationTriggerBase = {
    alias: st.optional(st.string()),
    id: st.optional(st.string()),
}

export const AutomationTriggerEvent = st.object({
    ...AutomationTriggerBase,
    platform: st.literal('event'),
    event_type: st.union([st.string(), st.array(st.string())]),
    event_data: st.any(),
    context: st.any(),
})

export const AutomationTriggerHA = st.object({
    ...AutomationTriggerBase,
    platform: st.literal('homeassistant'),
    event: st.enums(['start', 'shutdown']),
})

export const AutomationTriggerMQTT = st.object({
    ...AutomationTriggerBase,
    platform: st.literal('mqtt'),
    topic: st.string(),
    payload: st.string(),
    value_template: st.string(),
})

export const AutomationTriggerNumericState = st.object({
    ...AutomationTriggerBase,
    platform: st.literal('numeric_state'),
    entity_id: st.union([st.string(), st.array(st.string())]),
    attribute: st.optional(st.string()),
    value_template: st.optional(st.string()),
    above: st.optional(st.string()),
    below: st.optional(st.string()),
    for: st.optional(AutomationTime),
})

export const AutomationTriggerState = st.object({
    ...AutomationTriggerBase,
    platform: st.literal('state'),
    entity_id: st.union([st.string(), st.array(st.string())]),
    attribute: st.optional(st.string()),
    from: st.optional(st.string()),
    to: st.optional(st.string()),
    for: st.optional(AutomationTime),
})

export const AutomationTriggerTag = st.object({
    ...AutomationTriggerBase,
    platform: st.literal('tag'),
    tag_id: st.string(),
    device_id: st.union([st.string(), st.array(st.string())]),
})

export const AutomationTriggerTemplate = st.object({
    ...AutomationTriggerBase,
    platform: st.literal('template'),
    value_template: st.string(),
    for: st.optional(AutomationTime),
})

export const AutomationTriggerTime = st.object({
    ...AutomationTriggerBase,
    platform: st.literal('time'),
    at: AutomationTime,
})

export const AutomationTriggerTimePattern = st.object({
    ...AutomationTriggerBase,
    platform: st.literal('time_pattern'),
    hours: st.optional(st.string()),
    minutes: st.optional(st.string()),
    seconds: st.optional(st.string()),
})

export const AutomationTriggerWebhook = st.object({
    ...AutomationTriggerBase,
    platform: st.literal('webhook'),
    webhook_id: st.string(),
})

export const AutomationTriggerZone = st.object({
    ...AutomationTriggerBase,
    platform: st.literal('zone'),
    entity_id: st.union([st.string(), st.array(st.string())]),
    zone: st.string(),
    event: st.enums(['enter', 'leave'])
})

export const AutomationTriggerDevice = st.object({
    ...AutomationTriggerBase,
    platform: st.literal('device'),
    entity_id: st.optional(st.string()),
    device_id: st.string(),
    domain: st.string(),
    type: st.string(),
    subtype: st.optional(st.string()),
})


export const AutomationTrigger = st.union([
    AutomationTriggerEvent,
    AutomationTriggerHA,
    AutomationTriggerMQTT,
    AutomationTriggerNumericState,
    AutomationTriggerState,
    AutomationTriggerTag,
    AutomationTriggerTemplate,
    AutomationTriggerTime,
    AutomationTriggerTimePattern,
    AutomationTriggerWebhook,
    AutomationTriggerZone,
    AutomationTriggerDevice
])