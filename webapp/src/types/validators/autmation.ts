import * as st from 'superstruct'
import { AutomationMetadata } from './metadata'
import { AutomationTrigger } from './triggers';


export const AutomationData = st.object({
    metadata: AutomationMetadata,
    trigger: st.array(AutomationTrigger),
    condition: st.array(st.object()),
    sequence: st.array(st.object()),
    tags: st.record(st.string(), st.string()),
})