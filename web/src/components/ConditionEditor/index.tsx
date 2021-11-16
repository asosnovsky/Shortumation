import { FC, useState } from "react";
import { AutomationCondition } from "~/automations/types/conditions";
import { getDescriptionFromAutomationNode } from "~/automations/utils";
import { CheckMarkIcon, PencilIcon } from "~/icons/icons";
import { ConditionNode } from "./ConditionNode";
import { getEditor } from "./editorRender";
import { useStyles } from "./style";
import { getViewer } from "./viewRender";



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
    const [displayMode, setDisplayMode] = useState(true);

    return <ConditionNode
        displayMode={displayMode}
        condition={condition}
        onDelete={onDelete}
        onUpdate={update => {
            onUpdate(update)
        }}
        onAddChild={onAddChild}
        showDelete
    >
        {({classes}) => <button className={classes.modifyBtn} onClick={() => setDisplayMode(!displayMode)}>
            {displayMode ? <PencilIcon className={classes.icon}/> : <CheckMarkIcon className={classes.icon}/>}
        </button>}
    </ConditionNode>
}