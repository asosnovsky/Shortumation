import { Dispatch, SetStateAction, useEffect, useState, Component } from 'react';
import { AutomationNode, AutomationNodeTypes } from 'types/automations';
import { AutomationNodeSubtype } from 'types/automations';
import { getOptionManager } from './getOptionManager';
import { getNodeSubType, getSubTypeList, validateNode } from 'utils/automations';
import InputYaml from 'components/Inputs/InputYaml';
import InputText from 'components/Inputs/InputText';
import { getDescriptionFromAutomationNode } from 'utils/formatting';
import { useHA } from 'haService';
import { Generic } from './Generic';
import { getNodeTypeAndValidate } from '../../../utils/automations';

type UseState = <S>(s: S) => [S, Dispatch<SetStateAction<S>>]

export const useEditorNodeState = (originalNode: AutomationNode, isErrored: boolean, allowedTypes: AutomationNodeTypes[], uState: UseState = useState) => {
  // state
  const [allState, setAllState] = uState({
    yamlMode: false,
    isModified: false,
    ...computeInvalidYaml(originalNode, allowedTypes)
  });
  const { entities, namer } = useHA();
  // aliases
  const { node: currentNode, isModified, yamlMode, invalidManualYaml } = allState;
  // effects
  useEffect(() => {
    setAllState({ ...allState, node: originalNode, isModified: false, })
    // eslint-disable-next-line
  }, [originalNode])
  // function aliases
  const setState = (node: AutomationNode) => setAllState(({
    ...allState, node,
    isModified: JSON.stringify(node) !== JSON.stringify(originalNode),
  }));
  const setYamlMode = (yamlMode: boolean) => setAllState({ ...allState, yamlMode, });
  const setStateForManualYaml = (yaml: any) => {
    setAllState({
      ...allState,
      ...computeInvalidYaml(yaml, allowedTypes)
    })
  }
  // value aliases
  const {
    originalNodeType,
    originalNodeSubType,
    nodeType,
    subType,
    subTypes,
    optionManager,
  } = createData(originalNode, currentNode, allowedTypes)
  // publuc
  return {
    nodeType,
    subType,
    subTypes,
    setYamlMode,
    invalidManualYaml,
    isModified,
    isErrored: allState.isErrored,
    get prettyNodeType() {
      if (nodeType) {
        return `${nodeType.slice(0, 1).toUpperCase()}${nodeType.slice(1)} Type`
      } else {
        return 'n/a'
      }
    },
    get yamlMode() {
      return allState.isErrored || yamlMode
    },
    get data() {
      return currentNode
    },
    renderOptionList() {
      console.log('rendering option list')
      let aliasEditor = <></>
      if (nodeType === 'trigger') {
        aliasEditor = <InputText
          key="alias"
          label="Trigger ID"
          value={(allState.node as any).id}
          onChange={id => setState({
            ...allState.node,
            id
          } as any)}
        />
      }
      if (nodeType === 'action') {
        aliasEditor = <InputText
          key="alias"
          label="Alias"
          value={getDescriptionFromAutomationNode(allState.node, namer)}
          onChange={alias => setState({
            ...allState.node,
            alias
          } as any)}
        />
      }
      if (yamlMode || allState.isErrored) {
        return <>
          {aliasEditor}
          <InputYaml
            label=''
            value={currentNode}
            onChange={setStateForManualYaml}
            error={invalidManualYaml}
          />
        </>
      }
      return <>
        {aliasEditor}
        {('renderOptionList' in optionManager) ?
          optionManager.renderOptionList(currentNode, setState, entities) :
          <optionManager.Component state={currentNode} setState={setState} entities={entities} />}
      </>;
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
    setSubType(newSubType: AutomationNodeSubtype) {
      if (newSubType === originalNodeSubType) {
        setState(originalNode)
      } else {
        if (nodeType) {
          setState(getOptionManager(nodeType, newSubType as any).defaultState())
        } else {
          setState(getOptionManager(allowedTypes[0], newSubType as any).defaultState())
        }
      }
    }
  }
}


const createData = (originalNode: AutomationNode, currentNode: AutomationNode, allowedTypes: AutomationNodeTypes[]) => {
  let originalNodeType: AutomationNodeTypes = allowedTypes[0];
  let originalNodeSubType: AutomationNodeSubtype | null = null;
  let nodeType: AutomationNodeTypes = originalNodeType;
  let subType: AutomationNodeSubtype | null = originalNodeSubType;
  let subTypes: AutomationNodeSubtype[] = getSubTypeList(allowedTypes[0]);
  let optionManager = Generic;

  try {
    originalNodeType = getNodeTypeAndValidate(originalNode, allowedTypes);
    originalNodeSubType = getNodeSubType(originalNode);
  } catch (err) {
    console.error(`ORIGINAL NODE ERROR ${JSON.stringify(originalNode)}`)
  }
  try {
    nodeType = getNodeTypeAndValidate(currentNode, allowedTypes);
    subType = getNodeSubType(currentNode);
    subTypes = getSubTypeList(nodeType)
    optionManager = getOptionManager(nodeType, subType as any);
  } catch (err) {
    console.error(`CURRENT NODE ERROR ${JSON.stringify(currentNode)}`)
  }
  return {
    originalNodeType,
    originalNodeSubType,
    nodeType,
    subType,
    subTypes,
    optionManager,
  }
}

const computeInvalidYaml = (node: AutomationNode, allowedNodeTypes: AutomationNodeTypes[]) => {
  const errors = validateNode(node, allowedNodeTypes);
  if (errors) {
    console.log({ errors })
    return {
      node,
      isErrored: true,
      invalidManualYaml: <ul key={'error'} className="node-editor--error">
        {errors.map(({ message, path }, i) => <li key={i}>
          <b>{path}</b>: {message}
        </li>)}
      </ul>
    }
  } else {
    return {
      node,
      isErrored: false,
      invalidManualYaml: <></>
    }
  }
}