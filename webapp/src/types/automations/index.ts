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
    sequence: AutomationSequenceNode[];
}
export type AutomationSequenceNode = AutomationAction | AutomationCondition;
type AutomationNodeMapping = {
    "trigger": AutomationTrigger;
    "action": AutomationAction;
    "condition": AutomationCondition;
    "sequence": AutomationSequenceNode;
}
export type AutomationNodeTypes = keyof AutomationNodeMapping;
export type AutomationNode<N extends AutomationNodeTypes = any> = AutomationNodeMapping[N];
export type AutomationNodeSubtype<T extends AutomationNodeTypes = any> =
  T extends 'trigger' ? TriggerType :
  T extends 'action' ? ActionType :
  T extends 'condtion' ? ConditionType :
  T extends 'sequence' ? ConditionType | ActionType :
  never;
