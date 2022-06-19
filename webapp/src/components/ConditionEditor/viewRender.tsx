import { FC } from "react";
import {
  AutomationCondition,
  LogicCondition,
} from "types/automations/conditions";
import { getDescriptionFromAutomationNode, Namer } from "utils/formatting";
import { ConditionNode } from "./ConditionNode";
import { genUpdateMethods } from "./nestedUpdater";

interface Viewer<C extends AutomationCondition>
  extends FC<{
    condition: C;
    namer: Namer;
    onChange: (condition: C) => void;
  }> {}

export const getViewer = (condition: AutomationCondition): Viewer<any> => {
  if (
    condition.condition === "and" ||
    condition.condition === "or" ||
    condition.condition === "not"
  ) {
    return LogicViewer;
  }
  return GenericViewer;
};

export const GenericViewer: Viewer<AutomationCondition> = ({
  condition,
  namer,
}) => {
  return <>{getDescriptionFromAutomationNode(condition, namer, true)}</>;
};

export const LogicViewer: Viewer<LogicCondition> = ({
  condition,
  onChange,
}) => {
  return (
    <>
      {condition.conditions.map((c, i) => {
        return (
          <ConditionNode
            key={i}
            condition={c}
            displayMode
            {...genUpdateMethods(condition, onChange)(i)}
          />
        );
      })}
    </>
  );
};
