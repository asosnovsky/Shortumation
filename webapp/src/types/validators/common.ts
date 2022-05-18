import * as st from 'superstruct'


export const AutomationTimeString = st.refine(st.string(), 'TimeString', (v, c) => {
    // https://www.home-assistant.io/docs/automation/trigger/#time-string
    const bits: string[] = v.split(':')
    if ((bits.length !== 2) && (bits.length !== 3)) {
        return {
            "branch": c.branch,
            "message": "Time string should be either in the form 'HH:MM' or 'HH:MM:SS' as specified in https://www.home-assistant.io/docs/automation/trigger/#time-string",
            "path": c.path,
        }
    }
    for (let i = 0; i < bits.length; i++) {
        const b = bits[i];
        const num = Number(b);
        if (!Number.isInteger(num) || (num < 0) || (num > 23)) {
            return {
                "branch": c.branch,
                "message": "Time string should contain only positive numbers between 0-23 as specified in https://www.home-assistant.io/docs/automation/trigger/#time-string",
                "path": c.path.concat(
                    bits.slice(0, i)
                ).concat([`<<${b}>>`])
            }
        }
    }
    return true
})
export const AutomationTimeObject = st.object({
    hours: st.optional(st.number()),
    minutes: st.optional(st.number()),
    seconds: st.optional(st.number()),
    milliseconds: st.optional(st.number()),
});
export const AutomationTime = st.union([st.string(), AutomationTimeObject])
