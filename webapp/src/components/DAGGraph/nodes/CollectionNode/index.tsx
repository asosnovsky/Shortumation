import { NodeManager } from "components/DAGGraph/nodes/NodeManager";
import { CollectionNode } from "./CollectionNode";
import { CollectionNodeDataProps } from "./types";
import { SequenceNodeColor } from "../SequenceNode/types";

export const CollectionNodeMaker = NodeManager.register(
  "CollectionNode",
  CollectionNode,
  (pre: CollectionNodeDataProps, { node, flipped }) => ({
    ...pre,
    color: (pre.collectionType === "condition"
      ? "blue"
      : pre.collectionType === "action"
      ? "green"
      : "red") as SequenceNodeColor,
    sequenceNode: node,
    flipped,
  })
);
