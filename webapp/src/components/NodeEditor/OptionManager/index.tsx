import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AutomationNode, AutomationNodeTypes } from 'types/automations';
import { AutomationNodeSubtype } from 'types/automations';
import { getOptionManager } from './getOptionManager';
import { getNodeType, getNodeSubType, getSubTypeList, validateNode } from 'utils/automations';
import InputYaml from 'components/Inputs/InputYaml';

type UseState = <S>(s: S) => [S, Dispatch<SetStateAction<S>>]

export const useEditorNodeState = (originalNode: AutomationNode, isErrored: boolean, uState: UseState = useState) => {
  const [allState, setAllState] = uState({
    node: originalNode,
    yamlMode: false,
    isModified: false,
    ...computeInvalidYaml(originalNode, isErrored)
  });
  const { node: currentNode, isModified, yamlMode, invalidManualYaml } = allState;
  useEffect(() => {
    setAllState({ ...allState, node: originalNode, isModified: false, })
    // eslint-disable-next-line
  }, [originalNode])
  const setState = (node: AutomationNode) => setAllState(({ ...allState, node, isModified: true, }));
  const setYamlMode = (yamlMode: boolean) => setAllState({ ...allState, yamlMode, });
  const setStateForManualYaml = (yaml: any) => {
    try {
      createData(yaml, yaml)
      const errors = validateNode(yaml);
      if (errors) {
        setAllState({
          ...allState, invalidManualYaml: <ul key={'error'}>
            {errors.map(({ message, path }, i) => <li key={i}>
              <b>{path}</b>: {message}
            </li>)}
          </ul>
        })
      } else {
        setAllState({ ...allState, node: yaml, invalidManualYaml: <></> })
      }
    } catch (err) {
      setAllState({ ...allState, invalidManualYaml: <>{String(err)}</> })
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
    setYamlMode,
    invalidManualYaml,
    isModified,
    isErrored: allState.isErrored,
    get yamlMode() {
      return allState.isErrored || yamlMode
    },
    get data() {
      return currentNode
    },
    renderOptionList() {
      if (yamlMode || allState.isErrored) {

        return <>
          <InputYaml
            label=''
            value={currentNode}
            onChange={setStateForManualYaml}
          />
          <div className="node-editor--error">{invalidManualYaml}</div>
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

const computeInvalidYaml = (node: AutomationNode, isErrored: boolean) => {
  const errors = validateNode(node);
  if (errors) {
    return {
      isErrored: true,
      invalidManualYaml: <ul key={'error'}>
        {errors.map(({ message, path }, i) => <li key={i}>
          <b>{path}</b>: {message}
        </li>)}
      </ul>
    }
  } else {
    return {
      isErrored,
      invalidManualYaml: <></>
    }
  }
}