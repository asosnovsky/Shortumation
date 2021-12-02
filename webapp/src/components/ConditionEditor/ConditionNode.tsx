import { Classes } from "jss";
import { FC, useState, useEffect } from 'react';
import { getConditionDefaultValues } from "utils/defaults";
import { AutomationCondition } from "types/automations/conditions";
import { CheckMarkIcon, PencilIcon } from "components/Icons";
import InputList from "components/Inputs/InputList";
import InputYaml from "components/Inputs/InputYaml";
import { getEditor } from "./editorRender";
import { useStyles } from "./style";
import { getViewer } from "./viewRender";



export const ConditionNode: FC<{
  condition: AutomationCondition;
  displayMode: boolean;
  showDelete?: boolean;
  onDelete?: (which: 'root' | number) => void;
  onUpdate?: (data: AutomationCondition) => void;
  children?: (props: {
    classes: Classes<string>
  }) => JSX.Element,
}> = ({
  condition,
  showDelete = false,
  displayMode = true,
  onDelete = () => { },
  onUpdate = () => { },
  children = () => { },
}) => {
    // state
    const [internalDisplayMode, setInternalDisplayMode] = useState(displayMode);
    const [yamlMode, setYamlMode] = useState(false);
    // alias
    const effectiveDM = internalDisplayMode || yamlMode;
    // effect
    useEffect(() => {
      setInternalDisplayMode(displayMode);
    }, [displayMode])
    useEffect(() => {
      if (yamlMode) {
        setInternalDisplayMode(true);
      }
    }, [yamlMode])
    // alias
    const onAddChild = () => {
      if (
        (condition.condition === 'and') ||
        (condition.condition === 'or') ||
        (condition.condition === 'not')
      ) {
        onUpdate({
          ...condition,
          $smType: 'condition',
          condition_data: {
            ...condition.condition_data,
            conditions: condition.condition_data.conditions.concat({
              $smType: 'condition',
              condition: 'or',
              condition_data: {
                conditions: []
              }
            })
          }
        })
      }
    }
    // children
    let childrenConditions: JSX.Element;
    if (effectiveDM) {
      const Viewer = getViewer(condition);
      childrenConditions = <Viewer condition={condition} onChange={data => {
        onUpdate({
          ...data,
          $smType: 'condition',
        })
      }} />
    } else {
      const Editor = getEditor(condition);
      childrenConditions = <Editor condition={condition} onChange={data => {
        onUpdate({
          ...data,
          $smType: 'condition',
        })
      }} />
    }
    // styles
    let hasChildren = false;
    if (condition.condition === "not") {
      hasChildren = true
    } else if (condition.condition === 'and') {
      hasChildren = true
    } else if (condition.condition === 'or') {
      hasChildren = true
    }
    const { classes } = useStyles({ hasChildren });

    // components
    const DeleteButton = (p: { onClick?: () => void, isRoot?: boolean }) =>
      <button className={p.isRoot ? classes.deleteBtnRoot : classes.deleteBtn} onClick={p?.onClick}>X</button>

    return <div className={classes.root}>
      {(showDelete && !effectiveDM) && <DeleteButton isRoot onClick={() => onDelete('root')} />}
      <div className={classes.title}>
        <InputList
          label=""
          className={classes.titleText}
          current={condition.condition}
          options={[
            'or', 'not', 'and',
            'template',
            'numeric_state',
            'state',
            'time',
            'trigger',
            'zone',
          ]}
          onChange={n => onUpdate({
            $smType: 'condition',
            condition: n,
            condition_data: {
              ...getConditionDefaultValues(n),
              ...condition.condition_data,
            }
          } as any)}
        />
        {effectiveDM && <button className={classes.yamlBtn} onClick={() => setYamlMode(!yamlMode)}>
          {yamlMode ? 'visual' : 'yaml'}
        </button>}
        {!yamlMode && <button className={classes.modifyBtn} onClick={() => setInternalDisplayMode(!effectiveDM)}>
          {effectiveDM ? <PencilIcon className={classes.icon} /> : <CheckMarkIcon className={classes.icon} />}
        </button>}
      </div>
      <div className={classes.children}>
        {yamlMode && <InputYaml
          label=""
          value={condition.condition_data}
          onChange={update => onUpdate({
            ...condition,
            condition_data: update as any
          })}
          resizable
        />}
        {!yamlMode && childrenConditions}
        {!yamlMode && hasChildren && <div className={classes.addBtnContainer}>
          <button className={classes.addBtn} onClick={() => onAddChild()}>Add</button>
        </div>}
      </div>
      {children({ classes })}
    </div>
  }
