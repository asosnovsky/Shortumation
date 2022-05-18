import * as st from 'superstruct'


const AutomationActionNodeBase = {
    alias: st.optional(st.string()),
    variables: st.optional(st.record(st.string(), st.any())),
}

export const ServiceAction = st.object({
    ...AutomationActionNodeBase,
    data: st.any(),
    target: st.any(),
    service: st.string(),
})

export const RepeatAction = st.object({
    ...AutomationActionNodeBase,
    repeat: st.object({
        count: st.number(),
        sequence: st.array(),
    })
})


