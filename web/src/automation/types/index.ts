import { AutomationCondition } from "./condition";
import { AutomationScript } from "./script";
import { AutomationTrigger } from "./triggers";

export interface Automation {
    id: string;
    alias: string;
    description: string;
    trigger_variables: Record<string, string>;
    mode: "single" | "restart" | "queued" | "parallel";
    trigger: AutomationTrigger[];
    condition: AutomationCondition[];
    action: AutomationAction[];
}

export type AutomationNodeTypes = Pick<Automation, 'trigger' | 'condition' | 'action'>;
export type AutomationNodeType = keyof AutomationNodeTypes;
export type AutomationAction = AutomationScript | AutomationCondition;
export type AutomationNode<T extends AutomationNodeType> = 
    AutomationNodeTypes[T][number];

