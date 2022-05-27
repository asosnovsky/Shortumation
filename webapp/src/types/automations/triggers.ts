import * as st from 'superstruct'
import * as v from "types/validators/triggers";

export type AutomationTriggerEvent = st.Infer<typeof v.AutomationTriggerEvent>;
export type AutomationTriggerHA = st.Infer<typeof v.AutomationTriggerHA>;
export type AutomationTriggerMQTT = st.Infer<typeof v.AutomationTriggerMQTT>;
export type AutomationTriggerNumericState = st.Infer<typeof v.AutomationTriggerNumericState>;
export type AutomationTriggerState = st.Infer<typeof v.AutomationTriggerState>;
export type AutomationTriggerTag = st.Infer<typeof v.AutomationTriggerTag>;
export type AutomationTriggerTemplate = st.Infer<typeof v.AutomationTriggerTemplate>;
export type AutomationTriggerTime = st.Infer<typeof v.AutomationTriggerTime>;
export type AutomationTriggerTimePattern = st.Infer<typeof v.AutomationTriggerTimePattern>;
export type AutomationTriggerWebhook = st.Infer<typeof v.AutomationTriggerWebhook>;
export type AutomationTriggerZone = st.Infer<typeof v.AutomationTriggerZone>;
export type AutomationTriggerDevice = st.Infer<typeof v.AutomationTriggerDevice>;

export type AutomationTrigger =
    | AutomationTriggerEvent
    | AutomationTriggerHA
    | AutomationTriggerMQTT
    | AutomationTriggerNumericState
    | AutomationTriggerState
    | AutomationTriggerTag
    | AutomationTriggerTemplate
    | AutomationTriggerTime
    | AutomationTriggerTimePattern
    | AutomationTriggerWebhook
    | AutomationTriggerZone
    | AutomationTriggerDevice
    ;
export type TriggerType = AutomationTrigger['platform'];
