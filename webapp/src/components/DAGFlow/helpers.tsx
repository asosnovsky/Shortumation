import { FC } from "react";
import {
  DAGAutomationFlowDims,
  UpdateModalState,
} from "components/DAGFlow/types";
import { Node, XYPosition } from "react-flow-renderer";
import { AutomationCondition } from "types/automations/conditions";

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

export const makeOnEditAutomationConditions =
  (
    conditions: AutomationCondition[],
    updateConditions: (c: AutomationCondition[]) => void,
    openModal: UpdateModalState
  ) =>
  () =>
    openModal({
      single: true,
      node: {
        condition: "and",
        conditions,
      },
      allowedTypes: ["condition"],
      update: (c: AutomationCondition) => {
        if (c.condition === "and") {
          updateConditions(c.conditions);
        } else {
          updateConditions([c]);
        }
      },
    });
