import { Size } from "components/DAGGraph/elements/types";
import { ReactNode } from "react";
import { SequenceNodeActions, SequenceNodeColor } from "../SequenceNode/types";

export type CollectionNodeChildProps = Partial<SequenceNodeActions> & {
  enabled: boolean;
  label: ReactNode;
};
export type CollectionNodeDataProps = Size & {
  nodes: CollectionNodeChildProps[];
  onAddNode: () => void;
  color: SequenceNodeColor;
  hasInput?: boolean;
};

export type CollectionNodeProps = CollectionNodeDataProps & {
  sequenceNode: Size;
  flipped: boolean;
};
