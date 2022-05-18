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
): Array<AutomationNodeSubtype<T> | 'condition'> => {
  if (nodeType === 'action') {
    return actionTypes as any;
  } else if (nodeType === 'condition') {
    return conditionTypes as any;
  } else if (nodeType === 'trigger') {
    return triggerTypes as any;
  }
  return [];
}

export const getNodeSubType = <T extends AutomationNodeTypes>(
  node: AutomationNode<T>
): AutomationNodeSubtype<T> => {
  if ('condition' in node) {
    return node.condition as any;
  } else if ('platform' in node) {
    return node.platform as any;
  } else if ('service' in node) {
    return 'service' as any
  } else if ('repeat' in node) {
    return 'repeat' as any
  } else if ('wait_template' in node) {
    return 'wait' as any
  } else if ('event' in node) {
    return 'event' as any
  } else if ('device_id' in node) {
    return 'device' as any
  } else if ('choose' in node) {
    return 'choose' as any
  } else {
    throw new Error("Invalid node type!")
  }
}
