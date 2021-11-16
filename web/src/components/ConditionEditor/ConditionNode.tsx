import { Classes } from "jss";
import { FC } from "react";
import { AutomationCondition } from "~/automations/types/conditions";
import { getEditor } from "./editorRender";
import { useStyles } from "./style";
import { getViewer } from "./viewRender";



export const ConditionNode: FC<{
    condition: AutomationCondition;
    displayMode: boolean;
    showDelete?: boolean;
    onDelete?: (which: 'root' | number) => void;
    onAddChild?: () => void;
    onUpdate?: (data: AutomationCondition) => void;
    children?: (props: {
        classes: Classes<string>
    }) => JSX.Element,
}> = ({
    condition,
    showDelete=false,
    onDelete=() => {},
    onUpdate=() => {},
    displayMode=() => {},
    onAddChild=() => {},
    children=() => {},
}) => {
    // children
    let childrenConditions: JSX.Element;
    if (displayMode) {
        const Viewer = getViewer(condition);
        childrenConditions = <Viewer condition={condition}/>
    }   else {
        const Editor = getEditor(condition);
        childrenConditions = <Editor condition={condition} onChange={data => {
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
        {(showDelete || !displayMode) && <DeleteButton isRoot onClick={ () => onDelete('root')}/>}
        <div className={classes.title}>
            <span className={classes.titleText}>{condition.condition.replace('_', ' ')}</span>
        </div>
        <div className={classes.children}>
            {childrenConditions}
        </div>
        {children({classes})}
    </div>
}