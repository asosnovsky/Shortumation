import { useEffect, useState } from 'react';
import { AutomationNode, AutomationNodeTypes } from 'types/automations';
import { AutomationNodeSubtype } from 'types/automations';
import { getOptionManager } from './getOptionManager';
import { getNodeType, getSubTypeList } from 'utils/automations';
import { AutomationCondition } from 'types/automations/conditions';
import { AutomationAction } from 'types/automations/actions';
import { AutomationTrigger } from 'types/automations/triggers';


export const useEditorNodeState = (node: AutomationNode) => {
  const [{ node: state, isModified }, setAllState] = useState({
    node,
    isModified: false,
  });
  useEffect(() => {
    setAllState({ node, isModified: false })
  }, [node])
  const setState = (node: AutomationNode) => setAllState(({ node, isModified: true }));
  const originalNodeType = getNodeType(node);
  const nodeType = getNodeType(state);
  const subType: AutomationNodeSubtype =
    nodeType === 'action' ? (state as AutomationAction).action :
      nodeType === 'condition' ? (state as AutomationCondition).condition :
        (state as AutomationTrigger).platform;
  const subTypes = getSubTypeList(nodeType)
  const optionManager = getOptionManager(nodeType, subType as any);
  return {
    nodeType,
    subType,
    subTypes,
    get isModified() {
      return isModified
    },
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
      if (newType === originalNodeType) {
        if (originalNodeType === 'action') {
          setState({
            ...state,
            $smType: 'action',
            action: (node as any).action,
          } as any)
        } else if (originalNodeType === 'condition') {
          setState({
            ...state,
            condition: (node as any).condition
          } as any)
        } else {
          setState({
            ...state,
            platform: (node as any).platform
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
      if (nodeType === 'action') {
        setState({
          ...state,
          action: newSubType,
          ...getOptionManager(nodeType, newSubType as any).defaultState()
        } as any)
      } else if (nodeType === 'condition') {
        setState({
          ...state,
          condition: newSubType,
          ...getOptionManager(nodeType, newSubType as any).defaultState()
        } as any)
      } else {
        setState({
          ...state,
          platform: newSubType,
          ...getOptionManager(nodeType, newSubType as any).defaultState()
        } as any)
      }
    }
  }
}


