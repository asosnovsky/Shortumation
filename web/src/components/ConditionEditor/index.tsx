import { FC } from "react";
import { AutomationCondition } from "~/automations/types/conditions";
import { getDescriptionFromAutomationNode } from "~/automations/utils";
import { useStyles } from "./style";



export const ConditionEditor: FC<{
    condition: AutomationCondition;
    onDelete: (which: 'root' | number) => void;
    onAddChild: () => void;
}> = ({
    condition,
    onDelete,
    // onAddChild,
}) => {
    // alias
    let children = getDescriptionFromAutomationNode(condition);
    let hasChildren = false;
    if (condition.condition === "not") {
        children = "not"
        hasChildren = true
    } else if (condition.condition ==='and') {
        children = "and"
        hasChildren = true
    } else if (condition.condition ==='or') {
        children = "or"
        hasChildren = true
    }

    // styles
    const {classes} = useStyles({ hasChildren });

    // components
    const DeleteButton = (p: {onClick?: () => void, isRoot?: boolean}) => 
        <button className={p.isRoot ? classes.deleteBtnRoot : classes.deleteBtn} onClick={p?.onClick}>X</button>

    return <div className={classes.root}>
        <DeleteButton isRoot onClick={ () => onDelete('root')}/>
        <div className={classes.title}>
            {condition.condition.replace('_', '')}
        </div>
        <div className={classes.children}>
            {children}
        </div>
    </div>
}