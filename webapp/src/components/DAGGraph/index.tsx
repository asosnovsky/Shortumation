import { FC, useState, ReactNode } from "react";
import { AutomationSequenceNode } from "types/automations";
import { useHA } from "haService";
import { ModalState } from "./board/types";
import { createUpdater } from "./updater";
import { useAutomationNodes } from "./elements";
import { DEFAULT_DIMS } from "./elements/constants";
import { DAGGraphBoard } from "./board";
import { AutomationTrigger } from "types/automations/triggers";
import { AutomationCondition } from "types/automations/conditions";

export const DAGAutomationGraph: FC<{
  action: AutomationSequenceNode[];
  trigger: AutomationTrigger[];
  condition: AutomationCondition[];
  onActionUpdate: (s: AutomationSequenceNode[]) => void;
  onTriggerUpdate: (t: AutomationTrigger[]) => void;
  onConditionUpdate: (c: AutomationCondition[]) => void;
  isFlipped: boolean;
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
  const elementData = useAutomationNodes(
    {
      action: props.action,
      condition: props.condition,
      trigger: props.trigger,
    },
    {
      dims: {
        ...DEFAULT_DIMS,
        flipped: props.isFlipped,
      },
      namer,
      openModal: setModalState,
      stateUpdater: updater,
    }
  );
  return (
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
  );
};
