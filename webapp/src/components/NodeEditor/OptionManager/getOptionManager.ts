import { AutomationNodeTypes, AutomationNodeSubtype } from "types/automations"
import { ActionChooseState } from "./ActionChoose";
import { ActionDeviceState } from "./ActionDevice";
import { ActionCallServiceState } from "./ActionService";
import { OptionManager } from "./OptionManager";
import { ConditionLogicState } from "./ConditionLogic";
import { Generic } from "./Generic";
import { ActionRepeatState } from "./ActionRepeat";
import { ActionWaitState } from "./ActionWait";
import { ActionEventState } from "./ActionEvent";
import { TriggerEventState } from "./TriggerEvent";
import { TriggerHAState } from "./TriggerHA";
import { TriggerMQTTState } from "./TriggerMQTT";



export const getOptionManager = <T extends AutomationNodeTypes>(
    nodeType: T, 
    nodeSubtype: AutomationNodeSubtype<T>,
) :  OptionManager<any> => {
    if ( nodeType === 'action') {
        switch (nodeSubtype) {
          case "choose":
              return ActionChooseState;
          case "device":
              return ActionDeviceState;
          case 'event':
            return ActionEventState;
          case "repeat":
            return ActionRepeatState;
          case 'service':
            return ActionCallServiceState;
          case "wait":
            return ActionWaitState;
        }
    }
    if (nodeType === 'condition') {
      return ConditionLogicState
    }
  if (nodeType === "trigger") {
      switch (nodeSubtype) {
        case "event":
          return TriggerEventState
        case "homeassistant":
          return TriggerHAState
        case "mqtt":
          return TriggerMQTTState
      }
    }
  return Generic
}
