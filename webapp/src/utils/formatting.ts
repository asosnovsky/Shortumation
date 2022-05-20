import { AutomationNode, AutomationNodeTypes } from "types/automations";
import { AutomationTime } from "types/automations/common";


export const convertTimeToString = (t: AutomationTime) => {
    if (typeof t === 'string') {
        return t
    } else {
        const {
            hours = 0,
            minutes = 0,
            seconds = 0,
            milliseconds = 0,
        } = t
        return [hours, minutes, seconds, milliseconds].map(n => String(n).padStart(2, '0')).join(':')
    }
}
export const getDescriptionFromAutomationNode = <N extends AutomationNodeTypes>(node: AutomationNode<N>): string => {
    if (node.alias) {
        return node.alias;
    }
    if ('platform' in node) {
        if (node.platform === 'time') {
            return node.at
        }
        if (node.platform === 'homeassistant') {
            if (node.event === 'start') {
                return 'HA is starting'
            } else {
                return 'HA is shutting down'
            }
        }
        if (node.platform === 'tag') {
            return `Tag = ${node.tag_id}`
        }
        if (node.platform === 'state') {
            let out = "";
            if (typeof node.entity_id === 'string') {
                out = node.entity_id
            } else {
                out = node.entity_id[0] + " and more"
            }
            if (node.from) {
                out += ` from ${node.from}`
            }
            if (node.to) {
                out += ` to ${node.to}`
            }
            return out
        }
        return node.platform
    }
    if ('condition' in node) {
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
    }
    if ('service' in node) {
        return node.service
    }
    if ('repeat' in node) {
        return 'Repeat ' + node.repeat.count
    }
    if ('wait_template' in node) {
        let out = 'Wait on ' + node.wait_template;
        if (node.timeout) {
            out += (' for ' + convertTimeToString(node.timeout))
        }
        return out;
    }
    if ('event' in node) {
        return `Trigger ${node.event}`
    }
    if ('device_id' in node) {
        return `${node.type} on ${node.device_id}`
    }
    if ('choose' in node) {
        return "Choose"
    }
    return 'n/a'
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
