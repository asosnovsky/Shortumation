import { AutomationNode, AutomationNodeSubtype, AutomationNodeTypes } from "types/automations";


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