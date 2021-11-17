import { Classes } from "jss";
import { FC, useState } from "react";
import { getConditionDefaultValues } from "~/automations/defaults";
import { AutomationCondition } from "~/automations/types/conditions";
import { CheckMarkIcon, PencilIcon } from "~/icons/icons";
import InputList from "../Inputs/InputList";
import { getEditor } from "./editorRender";
import { useStyles } from "./style";
import { getViewer } from "./viewRender";



export const ConditionNode: FC<{
    condition: AutomationCondition;
    displayMode: boolean;
    showDelete?: boolean;
    onDelete?: (which: 'root' | number) => void;
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
    children=() => {},
}) => {
    // state
    const [internalDisplayMode, setInternalDisplayMode] = useState(true);
    // alias
    const effectiveDM = displayMode && internalDisplayMode;
    const onAddChild = () => {
        if(
            (condition.condition === 'and') ||
            (condition.condition === 'or') ||
            (condition.condition === 'not') 
        ) {
            onUpdate({
                ...condition,
                condition_data: {
                    ...condition.condition_data,
                    conditions: condition.condition_data.conditions.concat({
                        $smType: 'condition',
                        condition: 'or',
                        condition_data: {
                            conditions: []
                        }
                    })
                }
            })
        }
    }
    // children
    let childrenConditions: JSX.Element;
    if (effectiveDM) {
        const Viewer = getViewer(condition);
        childrenConditions = <Viewer condition={condition} onChange={data => {
            onUpdate(data)
        }}/>
    }   else {
        const Editor = getEditor(condition);
        childrenConditions = <Editor condition={condition} onChange={data => {
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
    console.log({condition: condition.condition, hasChildren})
    const {classes} = useStyles({ hasChildren });

    // components
    const DeleteButton = (p: {onClick?: () => void, isRoot?: boolean}) => 
        <button className={p.isRoot ? classes.deleteBtnRoot : classes.deleteBtn} onClick={p?.onClick}>X</button>

    return <div className={classes.root}>
        {(showDelete || !effectiveDM) && <DeleteButton isRoot onClick={ () => onDelete('root')}/>}
        <div className={classes.title}>
            {/* <span className={classes.titleText}>{condition.condition.replace('_', ' ')}</span> */}
            <InputList
                className={classes.titleText}
                current={condition.condition}
                options={[
                    'or', 'not', 'and', 
                    'template',
                    'numeric_state',
                    'state',
                    'time',
                    'trigger',
                    'zone',
                ]}
                onChange={n => onUpdate({
                    condition: n,
                    condition_data: {
                        ...getConditionDefaultValues(n),
                        ...condition.condition_data,
                    }
                } as any)}
            />
            <button className={classes.modifyBtn} onClick={() => setInternalDisplayMode(!effectiveDM)}>
                {effectiveDM ? <PencilIcon className={classes.icon}/> : <CheckMarkIcon className={classes.icon}/>}
            </button>
        </div>
        <div className={classes.children}>
            {childrenConditions}
            {hasChildren && <div className={classes.addBtnContainer}>
                <button className={classes.addBtn} onClick={() => onAddChild()}>Add</button>
            </div>}
        </div>
        {children({classes})}
    </div>
}