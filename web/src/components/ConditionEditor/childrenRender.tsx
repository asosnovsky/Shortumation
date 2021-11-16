import { FC } from "react";
import { AutomationCondition, TemplateCondition } from "~/automations/types/conditions";
import { getDescriptionFromAutomationNode } from "~/automations/utils";
import InputText from "../Inputs/InputText";


interface Editor<C extends AutomationCondition> extends FC<{
    condition: C,
    onChange: (condition: C) => void;
}> {}


export const getEditor = (condition: AutomationCondition): Editor<any> => {
    switch (condition.condition) {
        case 'template':
            return TemplateEditor;
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
        <InputText label="Template" value={condition.condition_data.value_template} onChange={value_template => onChange({
            ...condition,
            condition_data: {
                ...condition.condition_data,
                value_template
            }
        })}/>
    </div>
}