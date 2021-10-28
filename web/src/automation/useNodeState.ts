import { BaseStateManager } from "./StateManager/BaseManager";
import { ScriptCallService } from "./StateManager/ScriptService";
import { AutomationNode, AutomationNodeType } from "./types";

export const triggerTypes = [
    'Event',
    'Home Assistant',
    'MQTT',
    'Numeric State',
    'State',
    'Tag',
    'Template',
    'Time',
    'Time Pattern',
    'Webhook',
    'Zone',
    'Device',
] as const;
export type TriggerType = typeof triggerTypes[number];
export const conditionTypes = [
    'And' ,
    'Or' ,
    'Not',
    'Numeric State',
    'State',
    'Template',
    'Time',
    'Trigger',
    'Zone',
] as const;
export type ConditionType = typeof conditionTypes[number];
export const scriptTypes = [
    'Service',
    'Repeat',
    'Wait',
    'Event',
    'Device',
    'Choose'
] as const;
export type ScriptType = typeof scriptTypes[number];
export type NodeStateType<T> =
    T extends 'action' ? ScriptType :
    T extends 'condition' ? ConditionType :
    T extends 'trigger' ? TriggerType :
    never;

export const typeList = {
    'action': scriptTypes,
    'condition': conditionTypes,
    'trigger': triggerTypes,
} as const;

export const useNewNodeState = <T extends AutomationNodeType>(
    node_type: T, 
    node_subtype: NodeStateType<T>
) : BaseStateManager<AutomationNode<T>> => {
    if ( node_type === 'action') {
        switch (node_subtype) {
            case 'Service':
                return new ScriptCallService() as any;
            // case 'Repeat':
            //     return {
            //         repeat: {
            //             count: 0,
            //             sequence: [],
            //         }
            //     }
            // case 'Wait':
            //     return {
            //         wait_template: ""
            //     }
            // case 'Event':
            //     return {
            //         event: "",
            //         event_data: {}
            //     }
            // case "Device":
            //     return {
            //         type: "",
            //         device_id: "",
            //         entity_id: "",
            //         domain: "",
            //     }
            // case "Choose":
            //     return {
            //         choose: [],
            //         default: [],
            //     }
        }
    } 
    // else if (node_type === "condition") {
    //     if (node_subtype in ['And', 'Or', 'Noe']) {
    //         return {
    //             condition: node_subtype.toLowerCase(),
    //             conditions: [],
    //         }
    //     }   else if (node_subtype === 'Numeric State') {
    //         return {
    //             condition: "numeric_state",
    //             entity_id: ""
    //         }
    //     }   else if (node_subtype === 'State') {
    //         return {
    //             condition: "state",
    //             entity_id: "",
    //             state: "",
    //         }
    //     }
    // }

    throw new Error(`Invalid or Not implemented node type ${node_type} -> ${node_subtype}`)
}