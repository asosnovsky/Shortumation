import { FC } from "react";
import { AutomationCondition, LogicCondition, NumericCondition, TemplateCondition } from "~/automations/types/conditions";
import { getDescriptionFromAutomationNode } from "~/automations/utils";
import InputNumber from "../Inputs/InputNumber";
import InputText from "../Inputs/InputText";
import InputTextArea from "../Inputs/InputTextArea";
import { InputEntity } from "../Inputs/InputTextBubble";
import { ConditionNode } from "./ConditionNode";
import { genUpdateMethods } from "./nestedUpdater";


interface Editor<C extends AutomationCondition> extends FC<{
    condition: C,
    onChange: (condition: C) => void;
}> {}


export const getEditor = (condition: AutomationCondition): Editor<any> => {
    switch (condition.condition) {
        case 'template':
            return TemplateEditor;
        case 'and':
            return LogicViewer;
        case 'or':
            return LogicViewer;
        case 'not':
            return LogicViewer;
        case 'numeric_state':
            return NumericStateEditor;
        default:
            return () => <div>Not Ready</div>
    }
}

export const TemplateEditor: Editor<TemplateCondition> = ({
    onChange,
    condition,
}) => {
    return <div>
        <InputText label="Alias" value={condition.condition_data.alias ?? getDescriptionFromAutomationNode(condition)} onChange={alias => onChange({
            ...condition,
            condition_data: {
                ...condition.condition_data,
                alias
            }
        })}/>
        <InputTextArea label="Template" value={condition.condition_data.value_template} onChange={value_template => onChange({
            ...condition,
            condition_data: {
                ...condition.condition_data,
                value_template
            }
        })} resizable/>
    </div>
}


export const NumericStateEditor: Editor<NumericCondition> = ({
    onChange,
    condition,
}) => {
    return <div>
        <InputText label="Alias" value={condition.condition_data.alias ?? getDescriptionFromAutomationNode(condition)} onChange={alias => onChange({
            ...condition,
            condition_data: {
                ...condition.condition_data,
                alias
            }
        })}/>
        <InputEntity
            value={condition.condition_data.entity_id}
            onChange={entity_id => onChange({
                ...condition,
                condition_data: {
                    ...condition.condition_data,
                    entity_id
                }
            })}
        />
        <InputText label="Attribute" value={condition.condition_data.attribute ?? ""} onChange={attribute => onChange({
            ...condition,
            condition_data: {
                ...condition.condition_data,
                attribute
            }
        })}/>
        <InputNumber
            label="Above"
            value={condition.condition_data.above ? Number(condition.condition_data.above) : undefined}
            onChange={above => onChange({
                ...condition,
                condition_data: {
                    ...condition.condition_data,
                    above: above ? String(above) : undefined,
                }
            })}
        />
        <InputNumber
            label="Below"
            value={condition.condition_data.below ? Number(condition.condition_data.below) : undefined}
            onChange={below => onChange({
                ...condition,
                condition_data: {
                    ...condition.condition_data,
                    below: below ? String(below) : undefined,
                }
            })}
        />
        <InputTextArea label="Template" value={condition.condition_data.value_template ?? ""} onChange={value_template => onChange({
            ...condition,
            condition_data: {
                ...condition.condition_data,
                value_template
            }
        })} resizable/>
    </div>
}


export const LogicViewer: Editor<LogicCondition> = ({
    condition,
    onChange,
}) => {

    return <>
        {condition.condition_data.conditions.map( (c, i) => {
            return <ConditionNode 
                key={i} 
                condition={c} 
                displayMode={false}
                {...genUpdateMethods(condition, onChange)(i)}
            />
        } )}
    </>
}