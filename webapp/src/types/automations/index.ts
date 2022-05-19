import * as st from 'superstruct'

import { ActionType, AutomationAction } from "./actions";
import { AutomationCondition, ConditionType } from "./conditions";
import { AutomationTrigger, TriggerType } from "./triggers";
import * as mv from "types/validators/metadata";

export type AutomationMetadata = st.Infer<typeof mv.AutomationMetadata>
export interface AutomationData {
  metadata: AutomationMetadata;
  trigger: AutomationTrigger[];
  condition: AutomationCondition[];
  sequence: AutomationSequenceNode[];
  tags: Record<string, string>;
}
export type AutomationSequenceNode = AutomationAction | AutomationCondition;
export type AutomationNodeMapping = {
  "trigger": AutomationTrigger;
  "action": AutomationAction;
  "condition": AutomationCondition;
}
export type AutomationNodeTypes = keyof AutomationNodeMapping;
export type AutomationNode<N extends AutomationNodeTypes = any> =
  N extends 'trigger' ? AutomationTrigger :
  N extends 'action' ? AutomationAction :
  N extends 'condition' ? AutomationCondition :
  never;
export type AutomationNodeSubtype<T extends AutomationNodeTypes = any> =
  T extends 'trigger' ? TriggerType :
  T extends 'action' ? ActionType :
  T extends 'condition' ? ConditionType :
  never;
