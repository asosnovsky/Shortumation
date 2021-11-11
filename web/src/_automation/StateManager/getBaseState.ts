import { AutomationNodeType, NodeSubType } from "../types"
import ConditionLogicState from "./ConditionLogic"
import ScriptChooseState from "./ScriptChoose"
import ScriptDeviceState from "./ScriptDevice"
import ScriptEventState from "./ScriptEvent"
import ScriptRepeatState from "./ScriptRepeat"
import ScriptCallServiceState from "./ScriptService"
import ScriptWaitState from "./ScriptWait"


export const getBaseState = <T extends AutomationNodeType>(
    node_type: T, 
    node_subtype: NodeSubType<T>
) :  any => {
    if ( node_type === 'action') {
        switch (node_subtype) {
            case 'Service':
                return ScriptCallServiceState
            case "Repeat":
                return ScriptRepeatState;
            case "Wait":
                return ScriptWaitState;
            case "Event":
                return ScriptEventState;
            case "Device":
                return ScriptDeviceState;
            case "Choose":
                return ScriptChooseState;
        }
    }
    if (node_type === 'condition') {
        switch (node_subtype) {
            case 'Logic':
                return ConditionLogicState
        }
    }
    throw new Error(`Invalid or Not implemented node type ${node_type} -> ${node_subtype}`)
}