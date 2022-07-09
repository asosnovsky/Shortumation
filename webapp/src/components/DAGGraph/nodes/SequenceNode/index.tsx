import { NodeManager } from "components/DAGGraph/nodes/NodeManager";
import { SequenceNode } from "./SequenceNode";
import { SequenceNodeDataProps } from "./types";

export const SequenceNodeMaker = NodeManager.register(
  "SequenceNode",
  SequenceNode,
  (pre: SequenceNodeDataProps, { node, flipped }) => ({
    ...node,
    ...pre,
    flipped,
  })
);
