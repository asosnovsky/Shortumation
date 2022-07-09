import { ReactNode } from "react";
import { AutomationNodeTypes, AutomationSequenceNode } from "types/automations";
import { ElementData } from "../elements/types";
import { AutomationTrigger } from "types/automations/triggers";

export type DAGGraphBoardState =
  | {
      ready: false;
    }
  | {
      ready: true;
      data:
        | {
            error: ReactNode;
          }
        | {
            elements: ElementData;
          };
    };
export type DAGGraphBoardProps = {
  state: DAGGraphBoardState;
  modalState?: ModalState;
  closeModal: () => void;
};

export type ModalState<
  T extends AutomationSequenceNode | AutomationTrigger = any
> = {
  isError?: boolean;
  node: T;
  update: (n: T) => void;
  saveBtnCreateText?: boolean;
  allowedTypes: AutomationNodeTypes[];
};
