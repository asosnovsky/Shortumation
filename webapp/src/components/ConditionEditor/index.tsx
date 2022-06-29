import { FC } from "react";
import { AutomationCondition } from "types/automations/conditions";
import { ConditionNodeBase } from "./ConditionNodeBase";

export const ConditionEditor: FC<{
  condition: AutomationCondition;
  onDelete: () => void;
  onUpdate: (data: AutomationCondition) => void;
}> = ({ condition, onDelete, onUpdate }) => {
  // state
  return (
    <ConditionNodeBase
      condition={condition}
      onDelete={onDelete}
      onUpdate={(update) => {
        onUpdate(update);
      }}
      disableDelete={true}
    />
  );
};
