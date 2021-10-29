import { AutomationNode, AutomationNodeType, NodeSubType } from "../types"
import { BaseState } from "./BaseState"
import ScriptCallServiceState from "./ScriptService"


export const getBaseState = <T extends AutomationNodeType>(
    node_type: T, 
    node_subtype: NodeSubType<T>
) :  any => {
    if ( node_type === 'action') {
        switch (node_subtype) {
            case 'Service':
                return ScriptCallServiceState
        }
    }
    throw new Error(`Invalid or Not implemented node type ${node_type} -> ${node_subtype}`)
}