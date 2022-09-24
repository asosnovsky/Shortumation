import { FC, useState, ReactNode } from "react";
import { AutomationSequenceNode } from "types/automations";
import { useHA } from "services/ha";
import { ModalState } from "./board/types";
import { createUpdater } from "./updater";
import { useAutomationNodes } from "./elements";
import { DEFAULT_DIMS } from "./elements/constants";
import { DAGGraphBoard } from "./board";
import { AutomationTrigger } from "types/automations/triggers";
import { AutomationCondition } from "types/automations/conditions";
import { TriggerConditionNodeRow } from "./NodesRow";

export const DAGAutomationGraph: FC<{
  action: AutomationSequenceNode[];
  trigger: AutomationTrigger[];
  condition: AutomationCondition[];
  onActionUpdate: (s: AutomationSequenceNode[]) => void;
  onTriggerUpdate: (t: AutomationTrigger[]) => void;
  onConditionUpdate: (c: AutomationCondition[]) => void;
  isFlipped: boolean;
  useNodesRow: boolean;
  additionalControls?: ReactNode;
}> = (props) => {
  const { namer } = useHA();
  const [modalState, setModalState] =
    useState<ModalState | undefined>(undefined);
  const updater = createUpdater({
    openModal: setModalState,
    action: {
      data: props.action,
      onUpdate: props.onActionUpdate,
    },
    condition: {
      data: props.condition,
      onUpdate: props.onConditionUpdate as any,
    },
    trigger: {
      data: props.trigger,
      onUpdate: props.onTriggerUpdate as any,
    },
  });
  const dims = {
    ...DEFAULT_DIMS,
    flipped: props.isFlipped,
  };
  const elementData = useAutomationNodes(
    {
      action: props.action,
      condition: props.condition,
      trigger: props.trigger,
    },
    {
      dims,
      namer,
      openModal: setModalState,
      stateUpdater: updater,
    },
    props.useNodesRow
  );
  return (
    <>
      {props.useNodesRow && (
        <TriggerConditionNodeRow
          trigger={props.trigger}
          condition={props.condition}
          stateUpdater={updater}
          sequenceNodeDims={dims.node}
        />
      )}
      <DAGGraphBoard
        modalState={modalState}
        closeModal={() => setModalState(undefined)}
        state={{
          ready: true,
          data: {
            elements: elementData,
          },
        }}
        additionalControls={props.additionalControls}
      />
    </>
  );
};
