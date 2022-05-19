import * as v from "types/validators";
import { AutomationNode, AutomationNodeMapping, AutomationNodeSubtype, AutomationNodeTypes } from "types/automations";
import { AutomationTrigger } from 'types/automations/triggers';
import { MiniFailure } from "types/validators/helper";
import { getFailures } from '../types/validators/helper';


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


export const getNodeSubType = <T extends AutomationNodeTypes>(
    node: AutomationNode<T>
): AutomationNodeSubtype<T> => {
    if ('condition' in node) {
        return node.condition as any;
    } else if ('platform' in node) {
        return node.platform as any;
    } else if ('service' in node) {
        return 'service' as any
    } else if ('repeat' in node) {
        return 'repeat' as any
    } else if ('wait_template' in node) {
        return 'wait' as any
    } else if ('event' in node) {
        return 'event' as any
    } else if ('device_id' in node) {
        return 'device' as any
    } else if ('choose' in node) {
        return 'choose' as any
    } else {
        throw new Error("Invalid node type!")
    }
}


export const validateNode = (node: AutomationNode): MiniFailure[] | null => {
    const nodeType = getNodeType(node);
    try {
        const nodeSubType = getNodeSubType(node);
        if (nodeType === 'action') {
            if (nodeSubType === 'service') {
                return getFailures(node, v.actions.ServiceAction)
            } else if (nodeSubType === 'repeat') {
                return getFailures(node, v.actions.RepeatAction)
            } else if (nodeSubType === 'wait') {
                return getFailures(node, v.actions.WaitAction)
            } else if (nodeSubType === 'event') {
                return getFailures(node, v.actions.FireEventAction)
            } else if (nodeSubType === 'device') {
                return getFailures(node, v.actions.DeviceAction)
            } else if (nodeSubType === 'choose') {
                return getFailures(node, v.actions.ChooseAction)
            }
        } else if (nodeType === 'trigger') {
            if (nodeSubType === 'event') {
                return getFailures(node, v.triggers.AutomationTriggerEvent)
            } else if (nodeSubType === 'homeassistant') {
                return getFailures(node, v.triggers.AutomationTriggerHA)
            } else if (nodeSubType === 'mqtt') {
                return getFailures(node, v.triggers.AutomationTriggerMQTT)
            } else if (nodeSubType === 'numeric_state') {
                return getFailures(node, v.triggers.AutomationTriggerNumericState)
            } else if (nodeSubType === 'state') {
                return getFailures(node, v.triggers.AutomationTriggerState)
            } else if (nodeSubType === 'tag') {
                return getFailures(node, v.triggers.AutomationTriggerTag)
            } else if (nodeSubType === 'template') {
                return getFailures(node, v.triggers.AutomationTriggerTemplate)
            } else if (nodeSubType === 'time') {
                return getFailures(node, v.triggers.AutomationTriggerTime)
            } else if (nodeSubType === 'time_pattern') {
                return getFailures(node, v.triggers.AutomationTriggerTimePattern)
            } else if (nodeSubType === 'webhook') {
                return getFailures(node, v.triggers.AutomationTriggerWebhook)
            } else if (nodeSubType === 'zone') {
                return getFailures(node, v.triggers.AutomationTriggerZone)
            } else if (nodeSubType === 'device') {
                return getFailures(node, v.triggers.AutomationTriggerDevice)
            }
        } else if (nodeType === 'condition') {
            if (['and', 'or', 'not'].includes(nodeSubType)) {
                return getFailures(node, v.conditions.LogicCondition)
            } else if (nodeSubType === 'numeric_state') {
                return getFailures(node, v.conditions.NumericCondition)
            } else if (nodeSubType === 'state') {
                return getFailures(node, v.conditions.StateCondition)
            } else if (nodeSubType === 'template') {
                return getFailures(node, v.conditions.TemplateCondition)
            } else if (nodeSubType === 'trigger') {
                return getFailures(node, v.conditions.TriggerCondition)
            } else if (nodeSubType === 'time') {
                return getFailures(node, v.conditions.TimeCondition)
            } else if (nodeSubType === 'zone') {
                return getFailures(node, v.conditions.ZoneCondition)
            }
        }
    } catch (err) {
        console.warn(err)
    }
    return [
        { "message": ["Invalid or unknown " + nodeType], "path": "" },
    ]
}