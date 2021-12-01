import { Button } from "components/Inputs/Button";
import { useState, useEffect } from "react";
import { AutomationNodeTypes, AutomationNode, AutomationNodeSubtype } from "types/automations";
import { useNodeEditorStyles } from './styles';
import { getSubTypeList } from './constants';
import InputList from "components/Inputs/InputList";

export interface Props<T extends AutomationNodeTypes> {
  nodeType: T,
  subType: AutomationNodeSubtype<T>,
  onClose: () => void,
  onUpdate: (node: AutomationNode[T]) => void,
}
export function NodeEditor<T extends AutomationNodeTypes>({
  nodeType,
  subType,
  onClose,
  onUpdate,
}: Props<T>) {
  const { classes } = useNodeEditorStyles({});
  const currentSubTypeList = getSubTypeList(nodeType);
  const [selectedSubType, setSubType] = useState<AutomationNodeSubtype>(subType);
  // const stateManager = new StateManager(node_type, selectedSubType);

  // useEffect(() => {
  //   if (stateManager.nodeType !== node_type || stateManager.nodeSubtype !== selectedSubType) {
  //     stateManager.swapBaseState(node_type, selectedSubType)
  //   }
  // }, [node_type, selectedSubType]);

  return <div className={classes.root}>
    <div className={classes.background} onClick={() => onClose()}></div>
    <div className={classes.inner} onClick={e => e.preventDefault()}>
      <div className={classes.title}>
        Create {nodeType[0].toUpperCase()}{nodeType.slice(1)}
      </div>
      <div className={classes.body}>
        <InputList
          label="Type:"
          options={currentSubTypeList}
          current={selectedSubType}
          onChange={setSubType}
        />
        {/*{stateManager.renderOptionList()} */}
      </div>
      <div className={classes.footer}>
        <Button onClick={() => onClose()}>Close</Button>
        <Button
        // onClick={() => onUpdate(stateManager.state)}
        // disabled={!stateManager.isReady}
        >
          Save
        </Button>
      </div>
    </div>
  </div>
}
