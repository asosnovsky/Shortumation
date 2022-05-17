import { AutomationNode, AutomationNodeMapping, AutomationNodeSubtype, AutomationNodeTypes } from "types/automations";
import { AutomationTrigger } from 'types/automations/triggers';


export const getNodeType = (node: AutomationNode): AutomationNodeTypes => {
    if ('condition' in node) {
        return 'condition'
    } else if ('platform' in node) {
        return 'trigger'
    } else {
        return 'action'
    }
}

export const getSubTypeList = <T extends AutomationNodeTypes>(nodeType: T): AutomationNodeSubtype<T>[] => {
    switch (nodeType) {
        case 'action':
            return [
                "service",
                "repeat",
                "wait",
                "device",
                "choose",
            ] as any
        case "condition":
            return [
                'or',
                'and',
                'not',
                'numeric_state',
                'state',
                'template',
                'time',
                'trigger',
                'zone',
            ] as any
        case 'trigger':
            return [
                'event',
                'homeassistant',
                'mqtt',
                'numeric_state',
                'state',
                'tag',
                'template',
                'time',
                'time_pattern',
                'webhook',
                'zone',
                'device',
            ] as any
        default:
            return [];
    }
}


export const makeDefault = (nodeType: keyof AutomationNodeMapping): AutomationNode => {
    switch (nodeType) {
        case 'action':
            return {
                'data': {},
                'service': '',
                'target': {},
            }
        case 'condition':
            return {
                condition: 'and',
                conditions: []
            }
        default:
            return {
                platform: 'device',
                device_id: '',
                domain: '',
                type: '',
                subtype: '',
            } as AutomationTrigger
    }
}
