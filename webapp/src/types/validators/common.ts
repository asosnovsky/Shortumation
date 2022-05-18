import * as st from 'superstruct'


export const AutomationTime = st.object({
    hours: st.optional(st.number()),
    minutes: st.optional(st.number()),
    seconds: st.optional(st.number()),
    milliseconds: st.optional(st.number()),
})
