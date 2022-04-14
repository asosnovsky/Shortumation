import "./index.css";
import { DAGBoardElmDims } from "components/DAGSvgs/DAGBoard";
import { ArrowIcon, CheckMarkIcon, ZoomIcon } from "components/Icons";
import { SequenceNodes } from "components/SequenceNodes";
import { FC, useEffect, useState } from "react";
import { AutomationData, AutomationSequenceNode } from "types/automations";
import useWindowSize from "utils/useWindowSize";
import { AutoInfoBox } from "./AutoInfoBox";
import { useEditorStyles } from "./styles";
import { computeTriggerPos, computeExtraField } from './positions';
import { chain } from "utils/iter";
import { AutomationTrigger } from 'types/automations/triggers';
import { Modal } from "components/Modal";
import { NodeEditor } from "components/NodeEditor";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { Button } from "components/Inputs/Button";

interface TriggerEditorModalState {
  trigger: AutomationTrigger;
  onSave: (node: AutomationTrigger) => void;
}
interface Props {
  automation: AutomationData;
  dims: DAGBoardElmDims;
  onUpdate: (auto: AutomationData) => void;
}
export const AutomationEditor: FC<Props> = ({
  dims,
  automation: propsAutos,
  onUpdate: propsOnUpdate,
}) => {
  // state
  const [[autoChanged, automation], setAutomation] = useState<[
    'unchanged' | 'changed' | 'loading', AutomationData]
  >(['unchanged', propsAutos]);
  const [zoomLevel, setZoomLevel] = useState(40);
  const { ratioWbh } = useWindowSize();
  const [closeInfo, setCloseInfo] = useState(false);
  const [modalState, setModalState] = useState<null | TriggerEditorModalState>(null);
  const { classes } = useEditorStyles({
    closeInfo,
    horizontalMode: ratioWbh < 0.75
  });

  // alias
  const updateSequence = (sequence: AutomationSequenceNode[]) => onUpdate({
    ...automation,
    sequence,
  });
  const updateTriggers = (trigger: AutomationTrigger[]) => onUpdate({
    ...automation,
    trigger,
  });
  const onUpdate = (a: AutomationData) => setAutomation(['changed', a]);

  // effects
  useEffect(() => {
    setAutomation(['unchanged', propsAutos]);
  }, [propsAutos])

  // render
  return <div className={classes.root}>
    <Modal open={!!modalState}>
      {!!modalState && <NodeEditor
        node={modalState.trigger}
        onClose={() => setModalState(null)}
        onSave={(n) => {
          modalState.onSave(n as any);
          setModalState(null);
        }}
        allowedTypes={['trigger']}
      />}
    </Modal>
    <AutoInfoBox
      className={closeInfo ? "hide" : "show"}
      metadata={automation.metadata}
      onUpdate={metadata => onUpdate({ ...automation, metadata })}
    >
      <ButtonIcon
        className={`${classes.infoIcon} automation-editor--info-icon`}
        onClick={() => setCloseInfo(!closeInfo)}
        title={closeInfo ? "Show Metadata" : "Hide Metadata"}
      >{ArrowIcon}</ButtonIcon>
    </AutoInfoBox>

    <div className={classes.wrapper}>
      <div className={classes.toolbar}>
        <div style={{ display: 'flex' }}>
          <ZoomIcon className={classes.zoomImg} size={1} color="white" />
          <input
            type="number"
            min={1} max={100} step={1}
            className={classes.zoom}
            value={zoomLevel}
            onChange={z => setZoomLevel(z.target.valueAsNumber ?? 40)}
          />
        </div>
        {autoChanged !== 'unchanged' && <Button
          className={classes.saveBtn}
          onClick={() => {
            if (autoChanged === 'changed') {
              setAutomation(['loading', automation]);
              propsOnUpdate(automation);
            }
          }}
          disabled={autoChanged !== 'changed'}
        >
          Save <CheckMarkIcon />
        </Button>}
      </div>
      <SequenceNodes
        zoomLevel={zoomLevel * 200 / 100 + 50}
        startPoint={[2, 0.5]}
        dims={dims}
        sequence={automation.sequence}
        onChange={updateSequence}
        additionalElements={() => chain([
          computeExtraField([1, 0.5], [2, 0.5]),
          computeTriggerPos(
            [0.5, 0.5],
            automation.trigger,
            [1.5, 0.5],
            updateTriggers,
            () => {
              setModalState({
                trigger: {
                  $smType: "trigger",
                  platform: "device",
                  device_id: "",
                  domain: "",
                  type: "",
                  subtype: ""
                },
                onSave: (t) => updateTriggers([...automation.trigger, t])
              });
            },
            (trigger, onSave) => setModalState({
              trigger,
              onSave,
            })
          ),
        ])}
      />
    </div>
  </div>
}
