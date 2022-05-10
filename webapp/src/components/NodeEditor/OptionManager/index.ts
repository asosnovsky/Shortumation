import { useEffect, useState } from 'react';
import { AutomationNode, AutomationNodeTypes } from 'types/automations';
import { AutomationNodeSubtype } from 'types/automations';
import { getOptionManager } from './getOptionManager';
import { getNodeType, getSubTypeList } from 'utils/automations';
import { getNodeSubType } from '../constants';


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
  const originalNodeSubType = getNodeSubType(node);
  const nodeType = getNodeType(state);
  const subType = getNodeSubType(state);
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
        setState(node)
      } else {
        setState(getOptionManager(newType, getSubTypeList(newType)[0]).defaultState())
      }
    },
    setSubType(newSubType: AutomationNodeSubtype<typeof nodeType>) {
      if (newSubType === originalNodeSubType) {
        setState(node)
      } else {
        setState(getOptionManager(nodeType, newSubType as any).defaultState())
      }
    }
  }
}


