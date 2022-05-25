import { FC } from "react";
import { AutomationCondition, LogicCondition, NumericCondition, StateCondition, TemplateCondition, TimeCondition, TriggerCondition, ZoneCondition } from 'types/automations/conditions';
import { getDescriptionFromAutomationNode } from "utils/formatting";
import InputNumber from "components/Inputs/InputNumber";
import InputText from "components/Inputs/InputText";
import { InputEntity } from "components/Inputs/InputTextBubble";
import { ConditionNode } from "./ConditionNode";
import { genUpdateMethods } from "./nestedUpdater";
import InputTime from "components/Inputs/InputTime";
import InputYaml from "components/Inputs/InputYaml";


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
  return <>
    <InputText label="Alias" value={condition.alias ?? getDescriptionFromAutomationNode(condition)} onChange={alias => onChange({
      ...condition,
      alias
    })} />
    <InputYaml label="Template" value={condition.value_template} onChange={value_template => onChange({
      ...condition,
      value_template
    })} />
  </>
}


export const NumericStateEditor: Editor<NumericCondition> = ({
  onChange,
  condition,
}) => {
  return <>
    <InputText label="Alias" value={condition.alias ?? getDescriptionFromAutomationNode(condition)} onChange={alias => onChange({
      ...condition,
      alias
    })} />
    <InputEntity
      value={condition.entity_id}
      onChange={entity_id => onChange({
        ...condition,
        entity_id
      })}
    />
    <InputText label="Attribute" value={condition.attribute ?? ""} onChange={attribute => onChange({
      ...condition,
      attribute
    })} />
    <InputNumber
      label="Above"
      value={condition.above ? Number(condition.above) : undefined}
      onChange={above => onChange({
        ...condition,
        above: above ? String(above) : undefined,
      })}
    />
    <InputNumber
      label="Below"
      value={condition.below ? Number(condition.below) : undefined}
      onChange={below => onChange({
        ...condition,
        below: below ? String(below) : undefined,
      })}
    />
    <InputYaml label="Template" value={condition.value_template ?? ""} onChange={value_template => onChange({
      ...condition,
      value_template
    })} />
  </>
}


export const LogicViewer: Editor<LogicCondition> = ({
  condition,
  onChange,
}) => {

  return <>
    {condition.conditions.map((c, i) => {
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
  return <>
    <InputText label="Alias" value={condition.alias ?? getDescriptionFromAutomationNode(condition)} onChange={alias => onChange({
      ...condition,
      alias
    })} />
    <InputEntity
      value={condition.entity_id}
      onChange={entity_id => onChange({
        ...condition,
        entity_id
      })}
    />
    <InputText label="Attribute" value={condition.attribute ?? ""} onChange={attribute => onChange({
      ...condition,
      attribute
    })} />
    <InputText
      label="State"
      value={String(condition.state)}
      onChange={state => onChange({
        ...condition,
        state,
      })}
    />
    <InputTime
      label="For"
      value={condition.for}
      onChange={_for => onChange({
        ...condition,
        for: _for,
      })}
    />
  </>
}

export const TimeEditor: Editor<TimeCondition> = ({
  onChange,
  condition,
}) => {
  return <>
    <InputText label="Alias" value={condition.alias ?? getDescriptionFromAutomationNode(condition)} onChange={alias => onChange({
      ...condition,
      alias
    })} />
    <InputTime
      label="After"
      value={condition.after}
      onChange={after => onChange({
        ...condition,
        after,
      })}
    />
    <InputTime
      label="Before"
      value={condition.before}
      onChange={before => onChange({
        ...condition,
        before,
      })}
    />
    <b>Weekday not support for no, use yaml for now</b> {condition.weekday}
  </>
}

export const TriggerEditor: Editor<TriggerCondition> = ({
  onChange,
  condition,
}) => {
  return <>
    <InputText label="Alias" value={condition.alias ?? getDescriptionFromAutomationNode(condition)} onChange={alias => onChange({
      ...condition,
      alias
    })} />
    <InputText label="Trigger ID" value={condition.id} onChange={id => onChange({
      ...condition,
      id
    })} />
  </>
}

export const ZoneEditor: Editor<ZoneCondition> = ({
  onChange,
  condition,
}) => {
  return <>
    <InputText label="Alias" value={condition.alias ?? getDescriptionFromAutomationNode(condition)} onChange={alias => onChange({
      ...condition,
      alias
    })} />
    <InputText label="Zone" value={condition.zone} onChange={zone => onChange({
      ...condition,
      zone
    })} />
    <InputEntity
      value={condition.entity_id}
      onChange={entity_id => onChange({
        ...condition,
        entity_id
      })}
    />
    <InputText
      label="State"
      value={String(condition.state)}
      onChange={state => onChange({
        ...condition,
        state,
      })}
    />
  </>
}