import { FC } from "react";
import { AutomationCondition, LogicCondition, NumericCondition, StateCondition, TemplateCondition, TimeCondition, TriggerCondition, ZoneCondition } from 'types/automations/conditions';
import { getDescriptionFromAutomationNode } from "utils/formatting";
import InputNumber from "components/Inputs/InputNumber";
import InputText from "components/Inputs/InputText";
import InputTextArea from "components/Inputs/InputTextArea";
import { InputEntity } from "components/Inputs/InputTextBubble";
import { ConditionNode } from "./ConditionNode";
import { genUpdateMethods } from "./nestedUpdater";
import InputTime from "components/Inputs/InputTime";


interface Editor<C extends AutomationCondition> extends FC<{
  condition: C,
  onChange: (condition: C) => void;
}> { }


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
    case 'state':
      return StateEditor;
    case 'time':
      return TimeEditor;
    case 'trigger':
      return TriggerEditor;
    case 'zone':
      return ZoneEditor;
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
    })} />
    <InputTextArea label="Template" value={condition.condition_data.value_template} onChange={value_template => onChange({
      ...condition,
      condition_data: {
        ...condition.condition_data,
        value_template
      }
    })} resizable />
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
    })} />
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
    })} />
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
    })} resizable />
  </div>
}


export const LogicViewer: Editor<LogicCondition> = ({
  condition,
  onChange,
}) => {

  return <>
    {condition.condition_data.conditions.map((c, i) => {
      return <ConditionNode
        key={i}
        condition={c}
        displayMode={false}
        {...genUpdateMethods(condition, onChange)(i)}
        showDelete
      />
    })}
  </>
}



export const StateEditor: Editor<StateCondition> = ({
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
    })} />
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
    })} />
    <InputText
      label="State"
      value={String(condition.condition_data.state)}
      onChange={state => onChange({
        ...condition,
        condition_data: {
          ...condition.condition_data,
          state,
        }
      })}
    />
    <InputTime
      label="For"
      value={condition.condition_data.for}
      onChange={_for => onChange({
        ...condition,
        condition_data: {
          ...condition.condition_data,
          for: _for,
        }
      })}
    />
  </div>
}

export const TimeEditor: Editor<TimeCondition> = ({
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
    })} />
    <InputTime
      label="After"
      value={condition.condition_data.after}
      onChange={after => onChange({
        ...condition,
        condition_data: {
          ...condition.condition_data,
          after,
        }
      })}
    />
    <InputTime
      label="Before"
      value={condition.condition_data.before}
      onChange={before => onChange({
        ...condition,
        condition_data: {
          ...condition.condition_data,
          before,
        }
      })}
    />
    <b>Weekday not support for no, use yaml for now</b> {condition.condition_data.weekday}
  </div>
}

export const TriggerEditor: Editor<TriggerCondition> = ({
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
    })} />
    <InputText label="Trigger ID" value={condition.condition_data.id} onChange={id => onChange({
      ...condition,
      condition_data: {
        ...condition.condition_data,
        id
      }
    })} />
  </div>
}

export const ZoneEditor: Editor<ZoneCondition> = ({
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
    })} />
    <InputText label="Zone" value={condition.condition_data.zone} onChange={zone => onChange({
      ...condition,
      condition_data: {
        ...condition.condition_data,
        zone
      }
    })} />
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
    <InputText
      label="State"
      value={String(condition.condition_data.state)}
      onChange={state => onChange({
        ...condition,
        condition_data: {
          ...condition.condition_data,
          state,
        }
      })}
    />
  </div>
}