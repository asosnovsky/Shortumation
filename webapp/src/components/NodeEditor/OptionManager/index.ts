import { useState } from 'react';
import { AutomationNode, AutomationNodeTypes } from 'types/automations';
import { AutomationNodeSubtype } from 'types/automations';
import { BaseOptionManager } from './BaseOptionManager';
import { getOptionManager } from './getOptionManager';


export const useEditorNodeState = (node: AutomationNode) => {
  const [state, setState] = useState(node);
  const nodeType: AutomationNodeTypes = state.$smType ?? 'trigger';
  const subType: AutomationNodeSubtype =
    state.$smType === 'action' ? state.action :
    state.$smType === 'condition' ? state.condition :
    state.platform;  
  const optionManager: BaseOptionManager<any> = new (getOptionManager(nodeType, subType as any))(setState);
  return {
    nodeType,
    subType,
    renderOptionList() {
      return optionManager.renderOptionList(state);
    },
    isReady() {
      return optionManager.isReady(state);
    },
    get subTypes(): AutomationNodeSubtype<typeof nodeType>[] {
      switch (nodeType) {
        case 'action':
          return [
            "service",
            "repeat",
            "wait",
            "device",
            "choose",
          ]
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
          ]
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
          ]
        default:
          return [];
      }
    },

    setNodeType(newType: AutomationNodeTypes) {
      if (newType === (node.$smType ?? 'trigger')) {
        if (node.$smType === 'action') {
          setState({
            ...state,
            $smType: 'action',
            action: node.action
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
        } as any)
      }
    },
    setSubType(newSubType: AutomationNodeSubtype<typeof nodeType>) {
      if (state.$smType === 'action') {
        setState({
          ...state,
          action: newSubType,
        } as any)
      } else if (state.$smType === 'condition') {
        setState({
          ...state,
          condition: newSubType,
        } as any)
      } else {
        setState({
          ...state,
          platform: newSubType,
        } as any)
      }
    }
  }
}
