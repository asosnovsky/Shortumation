import { FC } from "react";
import { NodeProps, XYPosition, Node } from "react-flow-renderer";
import { DAGDims } from "../elements/types";

export type NodeMaker = ReturnType<typeof makeNodeMaker>;
export const makeNodeMaker = <
  NodeType extends string,
  PreNodeData extends {},
  NodeData extends {}
>(
  nodeType: NodeType,
  DAGNode: FC<NodeData>,
  convert: (pre: PreNodeData, dims: DAGDims) => NodeData
) => {
  return {
    get nodeType() {
      return nodeType;
    },
    GraphNode: (p: NodeProps<NodeData>) => {
      return <DAGNode {...p.data} />;
    },
    makeElement(
      reactFlowProps: {
        id: string;
        position: XYPosition;
        parentNode?: string;
      },
      dims: DAGDims,
      data: PreNodeData
    ): Node<NodeData> {
      return {
        ...reactFlowProps,
        type: nodeType,
        data: convert(data, dims),
      };
    },
  };
};
