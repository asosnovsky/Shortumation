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
export type SceneAction = st.Infer<typeof v.SceneAction>;
export type ChooseAction = OriginalChooseAction | IfElseAction;
export type OriginalChooseAction = AutomationActionNodeBase<{
  choose: Array<{
    conditions: AutomationCondition[];
    sequence: AutomationSequenceNode[];
  }>;
  default?: AutomationSequenceNode[];
}>;
export type IfElseAction = AutomationActionNodeBase<{
  if: AutomationCondition[];
  then: AutomationSequenceNode[];
  else: AutomationSequenceNode[];
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
  device: DeviceAction;

  event: FireEventAction;
  scene: SceneAction;

  repeat: RepeatAction;
  choose: ChooseAction;
  parallel: ParallelAction;

  wait: WaitAction | DelayAction;
  stop: StopAction;
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
  | SceneAction
  | DelayAction;
export type ActionType = keyof ActionTypeMapping;
