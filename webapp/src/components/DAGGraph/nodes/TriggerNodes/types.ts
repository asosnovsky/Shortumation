import { Size } from "components/DAGGraph/elements/types";
import { ReactNode } from "react";
import { SequenceNodeActions } from "../SequenceNode/types";

export type TriggerNodeChildProps = Partial<SequenceNodeActions> & {
  enabled: boolean;
  label: ReactNode;
};
export type TriggerNodeDataProps = {
  nodes: TriggerNodeChildProps[];
  onAddNode: () => void;
};

export type TriggerNodeProps = TriggerNodeDataProps &
  Size & {
    sequenceNode: Size;
    flipped: boolean;
  };
