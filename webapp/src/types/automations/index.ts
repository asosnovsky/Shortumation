import { ActionType, AutomationAction } from "./actions";
import { AutomationCondition, ConditionType } from "./conditions";
import { AutomationTrigger, TriggerType } from "./triggers";


export interface AutomationMetadata {
  id: string;
  alias: string;
  description: string;
  trigger_variables?: Record<string, string>;
  mode: "single" | "restart" | "queued" | "parallel";
}
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
export type AutomationNodeTypes = keyof AutomationNodeMapping | undefined;
export type AutomationNode<N extends AutomationNodeTypes = any> =
  N extends undefined ? AutomationTrigger :
  N extends 'trigger' ? AutomationTrigger :
  N extends 'action' ? AutomationAction :
  N extends 'condition' ? AutomationCondition :
  never;
export type AutomationNodeSubtype<T extends AutomationNodeTypes = any> =
  T extends undefined ? TriggerType :
  T extends 'trigger' ? TriggerType :
  T extends 'action' ? ActionType :
  T extends 'condition' ? ConditionType :
  never;
