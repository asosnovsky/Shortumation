import { FC } from "react";
import { DAGAutomationFlowDims } from "components/DAGFlow/types";
import { Node, XYPosition } from "react-flow-renderer";

export const convertToFlowNode =
  <D extends {}>(Component: FC<D>): FC<{ data: D }> =>
  ({ data }) => {
    return <Component {...data} />;
  };

export const createToNodeMakerFunction =
  <NodePreData extends {}, NodeData extends {}>(
    convert: (pre: NodePreData, dims: DAGAutomationFlowDims) => NodeData
  ) =>
  (
    id: string,
    position: XYPosition,
    data: NodePreData,
    dims: DAGAutomationFlowDims
  ): Node<NodeData> => ({
    id,
    type: "dagnode",
    position,
    data: convert(data, dims),
  });
