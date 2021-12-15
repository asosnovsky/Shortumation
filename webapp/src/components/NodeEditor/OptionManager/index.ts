import { useEffect, useState } from 'react';
import { AutomationNode, AutomationNodeTypes } from 'types/automations';
import { AutomationNodeSubtype } from 'types/automations';
import { getOptionManager } from './getOptionManager';


export const useEditorNodeState = (node: AutomationNode) => {
  const [state, setState] = useState(node);
  const nodeType: AutomationNodeTypes = state.$smType ?? 'trigger';
  const subType: AutomationNodeSubtype =
    state.$smType === 'action' ? state.action :
      state.$smType === 'condition' ? state.condition :
        state.platform;
  const subTypes  = getSubTypeList(nodeType)
  const optionManager = getOptionManager(nodeType, subType as any);
  return {
    nodeType,
    subType,
    subTypes,
    get data() {
      return state
    },
    renderOptionList() {
      return optionManager.renderOptionList(state, setState);
    },
    isReady() {
      return optionManager.isReady(state);
    },
    setNodeType(newType: AutomationNodeTypes) {
      if (newType === (node.$smType ?? 'trigger')) {
        if (node.$smType === 'action') {
          setState({
            ...state,
            $smType: 'action',
            action: node.action,
          } as any)
        } else if (node.$smType === 'condition') {
          setState({
            ...state,
            $smType: 'condition',
            condition: node.condition
          } as any)
        } else {
          setState({
            ...state,
            $smType: undefined,
            platform: node.platform
          } as any)
        }
      } else {
        setState({
          ...state,
          $smType: newType === 'trigger' ? undefined : newType,
          ...getOptionManager(newType, getSubTypeList(newType)[0]).defaultState()
        } as any)
      }
    },
    setSubType(newSubType: AutomationNodeSubtype<typeof nodeType>) {
      if (state.$smType === 'action') {
        setState({
          ...state,
          action: newSubType,
          ...getOptionManager(state.$smType, newSubType as any).defaultState()
        } as any)
      } else if (state.$smType === 'condition') {
        setState({
          ...state,
          condition: newSubType,
          ...getOptionManager(state.$smType, newSubType as any).defaultState()
        } as any)
      } else {
        setState({
          ...state,
          platform: newSubType,
          ...getOptionManager(state.$smType, newSubType as any).defaultState()
        } as any)
      }
    }
  }
}


const getSubTypeList = <T extends AutomationNodeTypes>(nodeType: T): AutomationNodeSubtype<T>[] => {
  switch (nodeType) {
    case 'action':
      return [
        "service",
        "repeat",
        "wait",
        "device",
        "choose",
      ] as any
    case "condition":
      return [
        'or',
        'and',
        'not',
        'numeric_state',
        'state',
        'template',
        'time',
        'trigger',
        'zone',
      ]as any
    case 'trigger':
      return [
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
        'device',
      ]as any
    default:
      return [];
  }
}
