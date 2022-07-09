import { NodeManager } from "components/DAGGraph/nodes/NodeManager";
import { TriggerNodes } from "./TriggerNodes";
import { TriggerNodeDataProps } from "./types";

export const TriggerNodesMaker = NodeManager.register(
  "TriggerNodes",
  TriggerNodes,
  (pre: TriggerNodeDataProps, { node, trigger, flipped }) => ({
    ...pre,
    ...trigger,
    sequenceNode: node,
    flipped,
  })
);
