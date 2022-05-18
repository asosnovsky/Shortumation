import * as st from 'superstruct'
import * as v from "types/validators/common";

export type AutomationTime = st.Infer<typeof v.AutomationTime>
export type AutomationTimeObject = st.Infer<typeof v.AutomationTimeObject>
export type AutomationTimeString = st.Infer<typeof v.AutomationTimeString>
