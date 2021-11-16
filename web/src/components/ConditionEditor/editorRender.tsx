import { FC } from "react";
import { AutomationCondition, LogicCondition, NumericCondition, TemplateCondition } from "~/automations/types/conditions";
import { getDescriptionFromAutomationNode } from "~/automations/utils";
import InputText from "../Inputs/InputText";
import InputTextArea from "../Inputs/InputTextArea";
import { InputEntity } from "../Inputs/InputTextBubble";
import { ConditionNode } from "./ConditionNode";


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
                onUpdate={update => onChange({
                    ...condition,
                    condition_data: {
                        ...condition.condition_data,
                        conditions: [
                            ...condition.condition_data.conditions.slice(0, i),
                            update,
                            ...condition.condition_data.conditions.slice(i+1)
                        ]
                    }
                })}
                onDelete={which => {
                    if (which === 'root') {
                        onChange({
                            ...condition,
                            condition_data: {
                                ...condition.condition_data,
                                conditions: condition.condition_data.conditions.slice(0, i).concat(
                                    condition.condition_data.conditions.slice(i+1)
                                )
                            }
                        })
                    }   else  {
                        const data = (c as LogicCondition).condition_data;
                        const update = {
                            ...condition.condition_data,
                            conditions: [
                                ...condition.condition_data.conditions.slice(0, i),
                                {
                                    ...c,
                                    condition_data: {
                                        ...data,
                                        conditions: data.conditions.slice(0, which).concat(data.conditions.concat(which+1))
                                    }
                                },
                                ...condition.condition_data.conditions.slice(i+1)
                            ]
                        }
                        onChange({
                            ...condition,
                            condition_data: update as any
                        })
                    }
                }}
            />
        } )}
    </>
}