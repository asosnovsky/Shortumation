import { FC } from "react";
import { AutomationCondition, LogicCondition, TemplateCondition } from "~/automations/types/conditions";
import { getDescriptionFromAutomationNode } from "~/automations/utils";
import { ConditionNode } from "./ConditionNode";


interface Viewer<C extends AutomationCondition> extends FC<{
    condition: C,
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
    return <div>
        {getDescriptionFromAutomationNode(condition)}
    </div>
}

export const LogicViewer: Viewer<LogicCondition> = ({
    condition,
}) => {
    return <>
        {condition.condition_data.conditions.map( (condition, i) => {
            return <ConditionNode key={i} condition={condition} displayMode/>
        } )}
    </>
}