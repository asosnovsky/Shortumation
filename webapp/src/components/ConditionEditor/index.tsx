import { FC } from "react";
import { AutomationCondition } from "types/automations/conditions";
import { ConditionNode } from "./ConditionNode";




export const ConditionEditor: FC<{
  condition: AutomationCondition;
  onDelete: (which: 'root' | number) => void;
  onUpdate: (data: AutomationCondition) => void;
}> = ({
  condition,
  onDelete,
  onUpdate,
}) => {
    // state
    return <ConditionNode
      condition={condition}
      onDelete={onDelete}
      onUpdate={update => {
        onUpdate(update)
      }}
      displayMode
      showDelete={false}
    />
  }
