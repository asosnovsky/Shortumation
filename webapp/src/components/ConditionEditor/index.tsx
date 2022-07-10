import { FC } from "react";
import { AutomationCondition } from "types/automations/conditions";
import { ConditionNodeBase } from "./ConditionNodeBase";
import { ConditionNodeViewMode } from "./ConditionNodeSettings";

export const ConditionEditor: FC<{
  condition: AutomationCondition;
  onDelete: () => void;
  onUpdate: (data: AutomationCondition) => void;
  initialViewMode?: ConditionNodeViewMode;
}> = ({ condition, onDelete, onUpdate, initialViewMode }) => {
  // state
  return (
    <ConditionNodeBase
      condition={condition}
      onDelete={onDelete}
      onUpdate={(update) => {
        onUpdate(update);
      }}
      disableDelete={true}
      initialViewMode={initialViewMode}
    />
  );
};
