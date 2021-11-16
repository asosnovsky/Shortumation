import { FC, useState } from "react";
import { AutomationCondition } from "~/automations/types/conditions";
import { getDescriptionFromAutomationNode } from "~/automations/utils";
import { CheckMarkIcon, PencilIcon } from "~/icons/icons";
import { getEditor } from "./childrenRender";
import { useStyles } from "./style";



export const ConditionEditor: FC<{
    condition: AutomationCondition;
    onDelete: (which: 'root' | number) => void;
    onAddChild: () => void;
    onUpdate: (data: AutomationCondition) => void;
}> = ({
    condition,
    onDelete,
    onUpdate,
    // onAddChild,
}) => {
    // state
    const [displayMode, setDisplayMode] = useState(true);

    // children
    let children: any = 'n/a'
    if (displayMode) {
        children = getDescriptionFromAutomationNode(condition);
    }   else {
        const Editor = getEditor(condition);
        children = <Editor condition={condition} onChange={data => {
            console.log({data})
            onUpdate(data)
        }}/>
    }
    // styles
    let hasChildren = false;
    if (condition.condition === "not") {
        hasChildren = true
    } else if (condition.condition ==='and') {
        hasChildren = true
    } else if (condition.condition ==='or') {
        hasChildren = true
    }
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
        <button className={classes.modifyBtn} onClick={() => setDisplayMode(!displayMode)}>
            {displayMode ? <PencilIcon className={classes.icon}/> : <CheckMarkIcon className={classes.icon}/>}
        </button>
    </div>
}