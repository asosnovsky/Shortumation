import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AutomationNode, AutomationNodeTypes } from 'types/automations';
import { AutomationNodeSubtype } from 'types/automations';
import { getOptionManager } from './getOptionManager';
import { getNodeType, getSubTypeList } from 'utils/automations';
import { getNodeSubType } from '../constants';
import InputYaml from 'components/Inputs/InputYaml';

type UseState = <S>(s: S) => [S, Dispatch<SetStateAction<S>>]

const mockUseState: UseState = s => {
  return [s, () => { }]
}

export const useEditorNodeState = (originalNode: AutomationNode, uState: UseState = useState) => {
  const [allState, setAllState] = uState({
    node: originalNode,
    yamlMode: false,
    isModified: false,
    invalidManualYaml: "",
  });
  const { node: currentNode, isModified, yamlMode, invalidManualYaml } = allState;
  useEffect(() => {
    setAllState({ ...allState, node: originalNode, isModified: false, })
  }, [originalNode])
  const setState = (node: AutomationNode) => setAllState(({ ...allState, node, isModified: true, }));
  const setYamlMode = (yamlMode: boolean) => setAllState({ ...allState, yamlMode, });
  const setStateForManualYaml = (yaml: any) => {
    try {
      createData(yaml, yaml)
      setAllState({ ...allState, node: yaml, invalidManualYaml: '' })
    } catch (err) {
      setAllState({ ...allState, invalidManualYaml: String(err) })
    }
  }
  const {
    originalNodeType,
    originalNodeSubType,
    nodeType,
    subType,
    subTypes,
    optionManager,
  } = createData(originalNode, currentNode);
  return {
    nodeType,
    subType,
    subTypes,
    yamlMode,
    setYamlMode,
    invalidManualYaml,
    isModified,
    get data() {
      return currentNode
    },
    renderOptionList() {
      if (yamlMode) {
        return <>
          <InputYaml
            label=''
            value={currentNode}
            onChange={setStateForManualYaml}
            resizable
          />
          <span className="node-editor--error">{invalidManualYaml}</span>
        </>
      }
      return optionManager.renderOptionList(currentNode, setState);
    },
    isReady() {
      return optionManager.isReady(currentNode);
    },
    setNodeType(newType: AutomationNodeTypes) {
      if (newType === originalNodeType) {
        setState(originalNode)
      } else {
        setState(getOptionManager(newType, getSubTypeList(newType)[0]).defaultState())
      }
    },
    setSubType(newSubType: AutomationNodeSubtype<typeof nodeType>) {
      if (newSubType === originalNodeSubType) {
        setState(originalNode)
      } else {
        setState(getOptionManager(nodeType, newSubType as any).defaultState())
      }
    }
  }
}


const createData = (originalNode: AutomationNode, currentNode: AutomationNode) => {
  const originalNodeType = getNodeType(originalNode);
  const originalNodeSubType = getNodeSubType(originalNode);
  const nodeType = getNodeType(currentNode);
  const subType = getNodeSubType(currentNode);
  const subTypes = getSubTypeList(nodeType)
  const optionManager = getOptionManager(nodeType, subType as any);

  return {
    originalNodeType,
    originalNodeSubType,
    nodeType,
    subType,
    subTypes,
    optionManager,
  }
}