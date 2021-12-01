import { AutomationNodeSubtype, AutomationNodeTypes } from "types/automations";


const actionTypes = [
  'choose',
  'device',
  'event',
  'repeat',
  'service',
  'wait',
] as AutomationNodeSubtype<'action'>[];

const conditionTypes = [
  'and',
  'not',
  'numeric_state',
  'or',
  'state',
  'template',
  'time',
  'trigger',
  'zone',
] as AutomationNodeSubtype<'condition'>[];

const triggerTypes = [
  'device',
  'event',
  'homeassistant',
  'mqtt',
  'numeric_state',
  'state',
  'tag',
  'template',
  'time',
  'time_pattern',
  'webhook',
  'zone',
] as AutomationNodeSubtype<'trigger'>[];

export const getSubTypeList = <T extends AutomationNodeTypes>(
  nodeType: T
): AutomationNodeSubtype<T>[] => {
  if (nodeType === 'action') {
    return actionTypes as any;
  } else if (nodeType === 'condition') {
    return conditionTypes as any;
  } else if (nodeType === 'trigger') {
    return triggerTypes  as any;
  } else if (nodeType === 'sequence') {
    return actionTypes.concat(conditionTypes) as any;
  }
  return [];
}
