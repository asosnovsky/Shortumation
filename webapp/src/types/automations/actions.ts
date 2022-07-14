import { AutomationSequenceNode } from ".";
import { AutomationCondition } from "./conditions";
import * as v from "types/validators/actions";
import * as st from "superstruct";
import { ScriptConditionField } from "./common";

type AutomationActionNodeBase<Data extends Object> = Data &
  st.Infer<typeof v.AutomationActionNodeBase>;

export type ServiceAction = st.Infer<typeof v.ServiceAction>;
export type RepeatAction = AutomationActionNodeBase<{
  repeat: {
    count?: number;
    while?: ScriptConditionField;
    until?: ScriptConditionField;
    sequence: AutomationAction[];
  };
}>;
export type WaitAction = st.Infer<typeof v.WaitAction>;
export type DelayAction = st.Infer<typeof v.DelayAction>;
export type FireEventAction = st.Infer<typeof v.FireEventAction>;
export type DeviceAction = st.Infer<typeof v.DeviceAction>;
export type StopAction = st.Infer<typeof v.StopAction>;
export type ChooseAction = AutomationActionNodeBase<{
  choose: Array<{
    conditions: AutomationCondition[];
    sequence: AutomationSequenceNode[];
  }>;
  default?: AutomationSequenceNode[];
}>;
export type ParallelAction = AutomationActionNodeBase<{
  parallel: Array<
    | AutomationAction
    | {
        sequence: AutomationAction[];
      }
  >;
}>;
export type AutomationAction =
  | ParallelAction
  | ServiceAction
  | RepeatAction
  | WaitAction
  | DelayAction
  | FireEventAction
  | DeviceAction
  | StopAction
  | ChooseAction;
export type ActionType =
  | "service"
  | "repeat"
  | "wait"
  | "event"
  | "device"
  | "stop"
  | "choose"
  | "parallel";
