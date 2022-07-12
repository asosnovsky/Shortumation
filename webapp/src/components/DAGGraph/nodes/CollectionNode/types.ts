import { Size } from "components/DAGGraph/elements/types";
import { ReactNode } from "react";
import { SequenceNodeActions, SequenceNodeColor } from "../SequenceNode/types";
import { AutomationActionData } from "types/automations";

export type CollectionNodeChildProps = Partial<SequenceNodeActions> & {
  enabled: boolean;
  label: ReactNode;
};
export type CollectionNodeDataProps = Size & {
  nodes: CollectionNodeChildProps[];
  onAddNode: () => void;
  hasInput?: boolean;
  collectionType: keyof AutomationActionData;
};

export type CollectionNodeProps = CollectionNodeDataProps & {
  sequenceNode: Size;
  flipped: boolean;
  color: SequenceNodeColor;
};
