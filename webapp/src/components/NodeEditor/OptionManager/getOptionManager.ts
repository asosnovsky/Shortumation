import { AutomationNodeTypes, AutomationNodeSubtype } from "types/automations";
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
import { TriggerNumericState } from "./TriggerNumericState";
import { TriggerState } from "./TriggerState";
import { TriggerTemplate } from "./TriggerTemplate";
import { TriggerTime } from "./TriggerTime";
import { TriggerWebhook } from "./TriggerWebhook";
import { TriggerZone } from "./TriggerZone";
import { TriggerDevice } from "./TriggerDevice";
import { ActionStopState } from "./ActionStop";
import { ActionParallelState } from "./ActionParallel";

export const getOptionManager = <T extends AutomationNodeTypes>(
  nodeType: T,
  nodeSubtype: AutomationNodeSubtype<T>
): OptionManager<any> => {
  if (nodeType === "action") {
    switch (nodeSubtype) {
      case "choose":
        return ActionChooseState;
      case "device":
        return ActionDeviceState;
      case "event":
        return ActionEventState;
      case "repeat":
        return ActionRepeatState;
      case "service":
        return ActionCallServiceState;
      case "wait":
        return ActionWaitState;
      case "stop":
        return ActionStopState;
      case "delay":
        return ActionWaitState;
      case "parallel":
        return ActionParallelState;
    }
  }
  if (nodeType === "condition") {
    return ConditionLogicState;
  }
  if (nodeType === "trigger") {
    switch (nodeSubtype) {
      case "event":
        return TriggerEventState;
      case "homeassistant":
        return TriggerHAState;
      case "mqtt":
        return TriggerMQTTState;
      case "numeric_state":
        return TriggerNumericState;
      case "state":
        return TriggerState;
      case "template":
        return TriggerTemplate;
      case "time":
        return TriggerTime;
      case "webhook":
        return TriggerWebhook;
      case "zone":
        return TriggerZone;
      case "device":
        return TriggerDevice;
    }
  }
  return Generic;
};
