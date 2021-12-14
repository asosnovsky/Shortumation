import { AutomationNodeSubtype, AutomationNodeTypes } from "types/automations";
import { AutomationNode } from '../../types/automations/index';


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
): Array<AutomationNodeSubtype<T>| 'condition'> => {
  if (nodeType === 'action') {
    return actionTypes as any;
  } else if (nodeType === 'condition') {
    return conditionTypes as any;
  } else if (nodeType === 'trigger') {
    return triggerTypes  as any;
  }
  return [];
}

export const getNodeSubType = <T extends AutomationNodeTypes>(
  node: AutomationNode<T>
): AutomationNodeSubtype<T> => {
  if (node.$smType === 'action') {
    return node.action as any;
  } else if(node.$smType === 'condition') {
    return node.condition as any;
  } else {
    return node.platform as any;
  }
}
