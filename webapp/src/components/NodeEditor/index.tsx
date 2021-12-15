
import { FC } from "react";
import { useNodeEditorStyles } from "./styles";
import { AutomationNode, AutomationNodeMapping } from 'types/automations/index';
import { useEditorNodeState } from "./OptionManager";
import InputList from "components/Inputs/InputList";
import { Button } from "components/Inputs/Button";




export interface Props {
  node: AutomationNode
  allowedTypes?: Array<keyof AutomationNodeMapping>;
}

export const NodeEditor: FC<Props> = ({
  node,
  allowedTypes = ["action", "condition", "trigger"]
}) => {
  const { classes } = useNodeEditorStyles({});
  const state = useEditorNodeState(node);

  return <div className={classes.root}>
    <div className={classes.background} />
    <div className={classes.inner}>
      <div className={classes.title}>

      </div>
      <div className={classes.body}>
        {allowedTypes.length > 1 ? <InputList
          label="Type"
          current={state.nodeType}
          options={allowedTypes}
          onChange={state.setNodeType}
        /> : <span>{state.nodeType}</span>}
        {state.nodeType !== 'condition' ? <InputList
          label={`${state.nodeType} type`}
          current={state.subType as any}
          options={state.subTypes}
          onChange={state.setSubType}
        /> : <></>}
        {state.renderOptionList()}
      </div>
      <div className={classes.footer}>
        <Button>Close</Button>
        <Button disabled={!state.isReady()}>Save</Button>
      </div>
    </div>
  </div>
}
