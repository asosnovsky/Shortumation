import { AutomationSequenceNode } from ".";
import { AutomationCondition } from "./conditions";
import * as v from "types/validators/actions";
import * as st from "superstruct";
import { ScriptConditionField } from "./common";

type AutomationActionNodeBase<Data extends Object> = Data &
  st.Infer<typeof v.AutomationActionNodeBase>;

export type ServiceAction = st.Infer<typeof v.ServiceAction>;
export type RepeatAction = AutomationActionNodeBase<{
  repeat:
    | {
        sequence: AutomationAction[];
        count: number;
      }
    | {
        sequence: AutomationAction[];
        until: ScriptConditionField;
      }
    | {
        sequence: AutomationAction[];
        while: ScriptConditionField;
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
    | AutomationSequenceNode
    | {
        sequence: AutomationSequenceNode[];
      }
  >;
}>;
export type ActionTypeMapping = {
  service: ServiceAction;
  repeat: RepeatAction;
  wait: WaitAction | DelayAction;
  event: FireEventAction;
  device: DeviceAction;
  stop: StopAction;
  choose: ChooseAction;
  parallel: ParallelAction;
};
export type AutomationAction =
  | ServiceAction
  | RepeatAction
  | WaitAction
  | FireEventAction
  | DeviceAction
  | StopAction
  | ChooseAction
  | ParallelAction
  | DelayAction;
export type ActionType = keyof ActionTypeMapping;
