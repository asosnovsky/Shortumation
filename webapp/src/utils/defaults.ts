import { AutomationCondition, LogicCondition, NumericCondition, StateCondition, TemplateCondition, TimeCondition, TriggerCondition, ZoneCondition } from "types/automations/conditions";
import { AutomationData } from 'types/automations';


export const getConditionDefaultValues = (condition: AutomationCondition['condition']): AutomationCondition['condition_data'] => {
    if (
        (condition === 'or') ||
        (condition === 'and') ||
        (condition === 'not')
    ) {
        return {
            conditions: []
        } as LogicCondition['condition_data']
    } else if (condition === 'template') {
        return {
            value_template: ""
        } as TemplateCondition['condition_data']
    } else if (condition === 'numeric_state') {
        return {
            entity_id: []
        } as NumericCondition['condition_data']
    } else if (condition === 'state') {
        return {
            entity_id: [],
            state: [],
        } as StateCondition['condition_data']
    } else if (condition === 'time') {
        return {
        } as TimeCondition['condition_data']
    } else if (condition === 'trigger') {
        return {
            id: ""
        } as TriggerCondition['condition_data']
    } else if (condition === 'zone') {
        return {
            zone: "",
            entity_id: [],
            state: [],
        } as ZoneCondition['condition_data']
    }
    throw new Error("NOT IMPLEMENTED!")
}

export const defaultAutomation = (id: string): AutomationData => ({
    metadata: {
        id,
        alias: "New Automation",
        description: "",
        mode: "single",
        tags: {},
    },
    trigger: [],
    sequence: [],
})
