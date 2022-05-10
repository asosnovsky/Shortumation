import { AutomationNode, AutomationNodeTypes } from "types/automations";
import { AutomationTime } from "types/automations/common";


export const convertTimeToString = ({
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
}: AutomationTime) => [hours, minutes, seconds, milliseconds].map(n => String(n).padStart(2, '0')).join(':')

export const getDescriptionFromAutomationNode = <N extends AutomationNodeTypes>(node: AutomationNode<N>): string => {
    if ('$smType' in node) {
        switch (node['$smType']) {
            case "action":
                if (node.action_data.alias) {
                    return node.action_data.alias;
                }
                switch (node.action) {
                    case 'service':
                        return node.action_data.service
                    case 'repeat':
                        return 'Repeat ' + node.action_data.repeat.count;
                    case 'wait':
                        let out = 'Wait on ' + node.action_data.wait_template;
                        if (node.action_data.timeout) {
                            out += (' for ' + convertTimeToString(node.action_data.timeout))
                        }
                        return out;
                    case 'event':
                        return `Trigger ${node.action_data.event}`
                    case 'device':
                        return `${node.action_data.type} on ${node.action_data.device_id}`
                    case 'choose':
                        return "Choose"
                }
        }
        return 'n/a'
    } else if ('condition' in node) {
        if (node.alias) {
            return node.alias;
        }
        if (
            (node.condition === 'and') ||
            (node.condition === 'or') ||
            (node.condition === 'not')
        ) {
            return "Logic"
        } else {
            switch (node.condition) {
                case "numeric_state":
                    if (node.entity_id) {
                        const center = prettyEntityId(node.entity_id);
                        if (node.above) {
                            if (node.below) {
                                return `${node.above} < ${center} < ${node.below}`
                            }
                            return `${center} > ${node.above}`
                        }
                        if (node.below) {
                            return `${center} < ${node.below}`
                        }
                        return `${center}?>?<`
                    }
                    return "Numeric State Condition"
                case "state":
                    return `${node.entity_id} is '${node.state}'`
                case 'template':
                    return node.value_template
                default:
                    return 'n/a'
            }
        }
    } else {
        if (node.alias) {
            return node.alias;
        }
        return node.platform
    }
}

export const prettyEntityId = (entityId: string | string[]) => {
    if (typeof entityId === 'string') {
        return entityId
    } else if (entityId.length === 1) {
        return entityId[0]
    } else {
        return "..."
    }
}
