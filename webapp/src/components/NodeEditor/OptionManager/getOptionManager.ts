import { AutomationNodeTypes, AutomationNodeSubtype, AutomationNode } from "types/automations"
import ActionChooseState from "./ActionChoose";
import ActionDeviceState from "./ActionDevice";
import ActionCallServiceState from "./ActionService"
import { BaseOptionManager } from "./BaseOptionManager";
import Generic from "./Generic";


export const getOptionManager = <T extends AutomationNodeTypes>(
    nodeType: T, 
    nodeSubtype: AutomationNodeSubtype<T>,
) :  any => {
    if ( nodeType === 'action') {
        switch (nodeSubtype) {
          case 'service':
            return ActionCallServiceState;
            // case "Repeat":
            //     return ScriptRepeatState;
            // case "Wait":
            //     return ScriptWaitState;
            // case "Event":
            //     return ScriptEventState;
            case "device":
                return ActionDeviceState;
            case "choose":
                return ActionChooseState;
        }
    }
    // if (nodeType === 'condition') {
    //     switch (nodeSubtype) {
    //         case 'Logic':
    //             return ConditionLogicState
    //     }
    // }
  return Generic
}
