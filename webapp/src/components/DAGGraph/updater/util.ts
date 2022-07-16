import { AutomationActionData, AutomationNodeTypes } from "types/automations";
import { ChooseAction, OriginalChooseAction } from "types/automations/actions";

export const mapAutoActionKeyToNodeType = (
  k: keyof AutomationActionData
): AutomationNodeTypes[] =>
  k === "condition"
    ? ["condition"]
    : k === "trigger"
    ? ["trigger"]
    : ["action", "condition"];

export const convertChooseActionToOrignal = (
  node: ChooseAction
): OriginalChooseAction => {
  if ("if" in node) {
    return {
      choose: [
        {
          conditions: node.if,
          sequence: node.then,
        },
      ],
      default: node.else,
    };
  } else {
    return node;
  }
};
