import { AutomationNode, AutomationNodeTypes } from "types/automations";
import { AutomationTime } from "types/automations/common";


export const convertTimeToString = ({
    hours=0,
    minutes=0,
    seconds=0,
    milliseconds=0,
}: AutomationTime) => [hours,minutes,seconds,milliseconds].map(n => String(n).padStart(2, '0')).join(':')

export const getDescriptionFromAutomationNode = <N extends AutomationNodeTypes>(node: AutomationNode<N>): string => {
    if (node.$smType) {
        switch (node['$smType']) {
            case "action":
                if (node.action_data.alias) {
                    return node.action_data.alias;
                }
                switch(node.action) {
                    case 'service':
                        return node.action_data.service
                    case 'repeat':
                        return 'Repeat ' + node.action_data.repeat.count;
                    case 'wait':
                        let out= 'Wait on ' + node.action_data.wait_template;
                        if (node.action_data.timeout) {
                            out += (' for ' + convertTimeToString(node.action_data.timeout))
                        }
                        return out;
                    case 'event':
                        return  `Trigger ${node.action_data.event}`
                    case 'device':
                        return `${node.action_data.type} on ${node.action_data.device_id}`
                    case 'choose':
                      return "Choose"
                    default:
                      return 'n/a'
                }
            case "condition":
                if (node.condition_data.alias) {
                    return node.condition_data.alias;
                }
                if(
                    (node.condition === 'and') || 
                    (node.condition === 'or') || 
                    (node.condition === 'not')
                ) {
                    return "Logic"
                } else {
                    switch(node.condition) {
                        case "numeric_state":
                            if(node.condition_data.entity_id) {
                                const center = prettyEntityId(node.condition_data.entity_id);
                                if(node.condition_data.above) {
                                    if(node.condition_data.below) {
                                        return `${node.condition_data.above} < ${center} < ${node.condition_data.below}`
                                    }
                                    return `${center} > ${node.condition_data.above}`
                                }
                                if(node.condition_data.below) {
                                    return `${center} < ${node.condition_data.below}`
                                }
                                return `${center}?>?<`
                            }
                            return "Numeric State Condition"
                        case "state":
                            return `${node.condition_data.entity_id} is '${node.condition_data.state}'`
                        case 'template':
                          return node.condition_data.value_template
                      default:
                          return 'n/a'
                    }
                }
        }
    } else {
        if (node.alias) {
            return node.alias;
        }
        return node.platform
    }
    return 'n/a'
}

export const prettyEntityId = (entityId: string| string[]) => {
    if (typeof entityId === 'string') {
        return entityId
    }   else if(entityId.length === 1) {
        return entityId[0]
    }   else {
        return "..."
    }
}

// export const determineNodeTypes = (action: AutomationNode<any>) : [AutomationNodeType, NodeSubType] => {
//     if ('condition' in action) {
//         switch (action.condition) {
//             case 'and':
//                 return ['condition', 'Logic']
//             case 'or':
//                 return ['condition', 'Logic']
//             case 'not':
//                 return ['condition', 'Logic']
//             case 'numeric_state':
//                 return ['condition', 'Numeric State']
//             case 'state':
//                 return ['condition', 'State']
//             case 'template':
//                 return ['condition', 'Template']
//             case 'trigger':
//                 return ['condition', 'Trigger']
//             case 'zone':
//                 return ['condition', 'Zone']
//             default:
//                 return ['condition', 'Generic']

//         }
//     }
//     if ('platform' in action) {
//         switch (action.platform) {
//             case 'event':
//                 return ['trigger', 'Event']
//             case 'homeassistant':
//                 return ['trigger', 'Home Assistant']
//             case 'mqtt':
//                 return ['trigger', 'MQTT']
//             case 'numeric_state':
//                 return ['trigger', 'Numeric State']
//             case 'state':
//                 return ['trigger', 'State']
//             case 'tag':
//                 return ['trigger', 'Tag']
//             case 'template':
//                 return ['trigger', 'Template']
//             case 'time':
//                 return ['trigger', 'Time']
//             case 'time_pattern':
//                 return ['trigger', 'Time Pattern']
//             case 'webhook':
//                 return ['trigger', 'Webhook']
//             case 'zone':
//                 return ['trigger', 'Zone']
//             default:
//                 return ['trigger', 'Generic']

//         }
//     }
//     if ('service' in action) {
//         return ["action", "Service"]
//     }
//     if ('repeat' in action) {
//         return ["action", "Repeat"]
//     }
//     if ('wait_template' in action) {
//         return ["action", "Wait"]
//     }
//     if ('event' in action) {
//         return  ["action", "Event"]
//     }
//     if (('type' in action) && ('device_id' in action)) {
//         return ["action", "Device"]
//     }
//     if ('choose' in action) {
//         return ["action", "Choose"]
//     }
//     throw Error(`Could not determine node type ${JSON.stringify(action)}`)
// }
