import { FC } from "react";
import { NodeTypes } from "react-flow-renderer";
import { makeNodeMaker } from "./NodeMaker";
import { DAGDims } from "../elements/types";

export const NodeManager = (() => {
  const nodeTypes: NodeTypes = {};
  return {
    get nodeTypes() {
      return nodeTypes;
    },
    register: <
      NodeType extends string,
      PreNodeData extends {},
      NodeData extends {}
    >(
      nodeType: NodeType,
      DAGNode: FC<NodeData>,
      convert: (pre: PreNodeData, dims: DAGDims) => NodeData
    ) => {
      const nodeMaker = makeNodeMaker(nodeType, DAGNode, convert);
      nodeTypes[nodeMaker.nodeType] = nodeMaker.GraphNode;
      return nodeMaker;
    },
  };
})();
