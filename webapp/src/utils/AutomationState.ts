import { AutomationData, AutomationSequenceNode } from "types/automations";
import { AutomationTrigger } from '../types/automations/triggers';

export type AumationStateEditor = ReturnType<typeof makeAumationStateEditor>;
export type AutomationStateTriggerEditor = AumationStateEditor['triggers'];

export const makeAumationStateEditor = (
    automation: AutomationData,
    onUpdate: (a: AutomationData) => void,
) => ({
    onUpdate,
    triggers: {
        update: (i: number, t: AutomationTrigger) => onUpdate({
            ...automation,
            trigger: automation.trigger
                .slice(0, i)
                .concat([t])
                .concat(
                    automation.trigger.slice(i + 1)
                )
        }),
        delete: (i: number) => onUpdate({
            ...automation,
            trigger: automation.trigger
                .slice(0, i)
                .concat(
                    automation.trigger.slice(i + 1)
                )
        }),
        add: (t: AutomationTrigger) => onUpdate({
            ...automation,
            trigger: automation.trigger
                .concat([t])
        }),
    },
    updateSequence: (s: AutomationSequenceNode[]) => onUpdate({
        ...automation,
        sequence: s,
    })
})