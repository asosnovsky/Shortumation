import * as st from "superstruct";

import { ActionType, AutomationAction } from "./actions";
import { AutomationCondition, ConditionType } from "./conditions";
import { AutomationTrigger, TriggerType } from "./triggers";
import * as mv from "types/validators/metadata";

export type AutomationMetadata = st.Infer<typeof mv.AutomationMetadata>;
export type AutomationShortumationMetadata = st.Infer<
  typeof mv.AutomationShortumationMetadata
>;
export interface AutomationActionData {
  trigger: AutomationTrigger[];
  condition: AutomationCondition[];
  action: AutomationSequenceNode[];
}
export interface BareAutomationData
  extends AutomationActionData,
    AutomationMetadata {
  tags: Record<string, string>;
}
export interface AutomationData
  extends BareAutomationData,
    AutomationShortumationMetadata {}

export type AutomationSequenceNode = AutomationAction | AutomationCondition;
export type AutomationNodeMapping = {
  trigger: AutomationTrigger;
  action: AutomationAction;
  condition: AutomationCondition;
};
export type AutomationNodeTypes = keyof AutomationNodeMapping;
export type AutomationNode<N extends AutomationNodeTypes = any> =
  N extends "trigger"
    ? AutomationTrigger
    : N extends "action"
    ? AutomationAction
    : N extends "condition"
    ? AutomationCondition
    : never;
export type AutomationNodeSubTypeMapping = {
  trigger: TriggerType;
  action: ActionType;
  condition: ConditionType;
};
export type AutomationNodeSubtype<T extends AutomationNodeTypes = any> =
  AutomationNodeSubTypeMapping[T];
