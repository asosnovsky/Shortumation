import { FC } from "react";
import { AutomationCondition } from "~/automations/types/conditions";
import { ConditionNode } from "./ConditionNode";




export const ConditionEditor: FC<{
    condition: AutomationCondition;
    onDelete: (which: 'root' | number) => void;
    onAddChild: () => void;
    onUpdate: (data: AutomationCondition) => void;
}> = ({
    condition,
    onDelete,
    onUpdate,
    onAddChild,
}) => {
    // state
    return <ConditionNode
        condition={condition}
        onDelete={onDelete}
        onUpdate={update => {
            onUpdate(update)
        }}
        onAddChild={onAddChild}
        displayMode
        showDelete
    />
}