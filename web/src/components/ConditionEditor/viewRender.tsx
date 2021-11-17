import { FC } from "react";
import { AutomationCondition, LogicCondition, TemplateCondition } from "~/automations/types/conditions";
import { getDescriptionFromAutomationNode } from "~/automations/utils";
import { ConditionNode } from "./ConditionNode";
import { genUpdateMethods } from "./nestedUpdater";


interface Viewer<C extends AutomationCondition> extends FC<{
    condition: C;
    onChange: (condition: C) => void;
}> {}

export const getViewer = (condition: AutomationCondition): Viewer<any> => {
    if(
        (condition.condition === 'and') ||
        (condition.condition === 'or') ||
        (condition.condition === 'not')
    )
    {
        return LogicViewer
    }
    return GenericViewer
}

export const GenericViewer: Viewer<AutomationCondition> = ({
    condition,
}) => {
    return <>
        {getDescriptionFromAutomationNode(condition)}
    </>
}

export const LogicViewer: Viewer<LogicCondition> = ({
    condition,
    onChange,
}) => {
    return <>
        {condition.condition_data.conditions.map( (c, i) => {
            return <ConditionNode key={i} condition={c} displayMode 
                {...genUpdateMethods(condition, onChange)(i)}
            />
        } )}
    </>
}