import { AutomationActionData, AutomationNodeTypes } from "types/automations";

export const mapAutoActionKeyToNodeType = (
  k: keyof AutomationActionData
): AutomationNodeTypes[] =>
  k === "condition"
    ? ["condition"]
    : k === "trigger"
    ? ["trigger"]
    : ["action", "condition"];
