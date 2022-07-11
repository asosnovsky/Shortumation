import { NodeManager } from "components/DAGGraph/nodes/NodeManager";
import { ButtonNode } from "./ButtonNode";
import { ButtonNodeDataProps } from "./types";

export const ButtonNodeMaker = NodeManager.register(
  "ButtonNode",
  ButtonNode,
  (pre: ButtonNodeDataProps, { node, flipped }) => ({
    ...node,
    ...pre,
    flipped,
  })
);
