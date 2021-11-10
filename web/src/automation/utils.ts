import { AutomationNode, AutomationNodeType, NodeSubType } from "./types";


export const getDescriptionFromAutomationNode = (action: AutomationNode<any>): string => {
    if(typeof action === 'string') {
        return action;
    }
    if ('alias' in action && action.alias){
        return action.alias;
    }
    if ('condition' in action) {
        if(
            (action.condition === 'and') || 
            (action.condition === 'or') || 
            (action.condition === 'not')
        ) {
            return "Logic"
        } else {
            switch(action.condition) {
                case "numeric_state":
                    if(action.entity_id) {
                        const center = typeof action.entity_id === 'string' ? action.entity_id : '...'
                        if(action.above) {
                            if(action.below) {
                                return `${action.above} < ${center} < ${action.below}`
                            }
                            return `${center} > ${action.above}`
                        }
                        if(action.below) {
                            return `${center} < ${action.below}`
                        }
                        return `${center}?>?<`
                    }
                    return "Numeric State Condition"
                }
        }
    }
    if ('service' in action) {
        return action.service
    }
    if ('repeat' in action) {
        return 'Repeat ' + action.repeat.count;
    }
    if ('wait_template' in action) {
        let out= 'Wait on ' + action.wait_template;
        if (action.timeout) {
            out += (' for ' + action.timeout)
        }
        return out;
    }
    if ('event' in action) {
        return  `Trigger ${action.event}`
    }
    if ('type' in action) {
        return `${action.type} on ${action.device_id}`
    }
    if ('choose' in action) {
        return 'Choose'
    }
    return 'n/a'
}

export const determineNodeTypes = (action: AutomationNode<any>) : [AutomationNodeType, NodeSubType] => {
    if ('condition' in action) {
        switch (action.condition) {
            case 'and':
                return ['condition', 'Logic']
            case 'or':
                return ['condition', 'Logic']
            case 'not':
                return ['condition', 'Logic']
            case 'numeric_state':
                return ['condition', 'Numeric State']
            case 'state':
                return ['condition', 'State']
            case 'template':
                return ['condition', 'Template']
            case 'trigger':
                return ['condition', 'Trigger']
            case 'zone':
                return ['condition', 'Zone']
            default:
                return ['condition', 'Generic']

        }
    }
    if ('platform' in action) {
        switch (action.platform) {
            case 'event':
                return ['trigger', 'Event']
            case 'homeassistant':
                return ['trigger', 'Home Assistant']
            case 'mqtt':
                return ['trigger', 'MQTT']
            case 'numeric_state':
                return ['trigger', 'Numeric State']
            case 'state':
                return ['trigger', 'State']
            case 'tag':
                return ['trigger', 'Tag']
            case 'template':
                return ['trigger', 'Template']
            case 'time':
                return ['trigger', 'Time']
            case 'time_pattern':
                return ['trigger', 'Time Pattern']
            case 'webhook':
                return ['trigger', 'Webhook']
            case 'zone':
                return ['trigger', 'Zone']
            default:
                return ['trigger', 'Generic']

        }
    }
    if ('service' in action) {
        return ["action", "Service"]
    }
    if ('repeat' in action) {
        return ["action", "Repeat"]
    }
    if ('wait_template' in action) {
        return ["action", "Wait"]
    }
    if ('event' in action) {
        return  ["action", "Event"]
    }
    if (('type' in action) && ('device_id' in action)) {
        return ["action", "Device"]
    }
    if ('choose' in action) {
        return ["action", "Choose"]
    }
    throw Error(`Could not determine node type ${JSON.stringify(action)}`)
}