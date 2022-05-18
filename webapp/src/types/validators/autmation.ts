import * as st from 'superstruct'
import { AutomationMetadata } from './metadata'


export const AutomationData = st.object({
    metadata: AutomationMetadata,
    trigger: st.array(st.object()),
    condition: st.array(st.object()),
    sequence: st.array(st.object()),
    tags: st.record(st.string(), st.string()),
})