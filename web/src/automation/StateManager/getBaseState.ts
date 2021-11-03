import { AutomationNodeType, NodeSubType } from "../types"
import ScriptRepeatState from "./ScriptRepeat"
import ScriptCallServiceState from "./ScriptService"
import ScriptWaitState from "./ScriptWait"


export const getBaseState = <T extends AutomationNodeType>(
    node_type: T, 
    node_subtype: NodeSubType<T>
) :  any => {
    console.log(node_subtype)
    if ( node_type === 'action') {
        switch (node_subtype) {
            case 'Service':
                return ScriptCallServiceState
            case "Repeat":
                return ScriptRepeatState;
            case "Wait":
                return ScriptWaitState;
        }
    }
    throw new Error(`Invalid or Not implemented node type ${node_type} -> ${node_subtype}`)
}