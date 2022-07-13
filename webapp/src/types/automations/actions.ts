import { AutomationSequenceNode } from ".";
import { AutomationCondition } from "./conditions";
import * as v from "types/validators/actions";
import * as st from "superstruct";

type AutomationActionNodeBase<Data extends Object> = Data &
  st.Infer<typeof v.AutomationActionNodeBase>;

export type ServiceAction = st.Infer<typeof v.ServiceAction>;
export type RepeatAction = AutomationActionNodeBase<{
  repeat: {
    count?: number;
    while: AutomationCondition[];
    sequence: AutomationAction[];
  };
}>;
export type WaitAction = st.Infer<typeof v.WaitAction>;
export type DelayAction = st.Infer<typeof v.DelayAction>;
export type FireEventAction = st.Infer<typeof v.FireEventAction>;
export type DeviceAction = st.Infer<typeof v.DeviceAction>;
export type ChooseAction = AutomationActionNodeBase<{
  choose: Array<{
    conditions: AutomationCondition[];
    sequence: AutomationSequenceNode[];
  }>;
  default?: AutomationSequenceNode[];
}>;
export type AutomationAction =
  | ServiceAction
  | RepeatAction
  | WaitAction
  | DelayAction
  | FireEventAction
  | DeviceAction
  | ChooseAction;
export type ActionType =
  | "service"
  | "repeat"
  | "wait"
  | "event"
  | "device"
  | "choose";
