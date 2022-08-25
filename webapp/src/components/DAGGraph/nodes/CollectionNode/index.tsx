import { NodeManager } from "components/DAGGraph/nodes/NodeManager";
import { CollectionNode } from "./CollectionNode";
import { CollectionNodeDataProps } from "./types";

export const CollectionNodeMaker = NodeManager.register(
  "CollectionNode",
  CollectionNode,
  (pre: CollectionNodeDataProps, { node, flipped }) => ({
    ...pre,
    sequenceNode: node,
    flipped,
  })
);
