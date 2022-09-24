import { XYPosition } from "react-flow-renderer";

import AddBox from "@mui/icons-material/AddBox";

import { getDescriptionFromAutomationNode, Namer } from "utils/formatting";
import { validateNode } from "utils/automations";
import { AutomationCondition } from "types/automations/conditions";
import { AutomationTrigger } from "types/automations/triggers";

import { DAGDims, ElementMaker, ElementMakerProps } from "./types";
import { DAGElementsOutputState } from "./outputState";
import { convertFailuresToSequenceNodeDataProps } from "./util";

import { ButtonNodeMaker } from "../nodes/ButtonNode";
import { CollectionNodeMaker } from "../nodes/CollectionNode";
import { DAGGraphUpdater } from "../updater/index";
import { AutomationActionData } from "types/automations";

export function makeCollectionNodeMakerChildProps<
  NodeType extends keyof AutomationActionData,
  Node extends AutomationActionData[NodeType][0]
>(
  nodeType: NodeType,
  node: Node,
  index: number,
  stateUpdater: DAGGraphUpdater,
  namer: Namer
) {
  const failures = validateNode(node, [nodeType]);

  if (failures) {
    return {
      enabled: node.enabled ?? true,
      ...stateUpdater.createNodeActions(nodeType, index, {}),
      ...convertFailuresToSequenceNodeDataProps(failures),
    };
  }

  return {
    enabled: node.enabled ?? true,
    label: getDescriptionFromAutomationNode(node, namer, true),
    ...stateUpdater.createNodeActions(nodeType, index, {}),
  };
}

export const makeTriggerNodes: ElementMaker<AutomationTrigger> = (
  nodes,
  { dims, namer, stateUpdater, nodeId, position }
) => {
  const outputState = new DAGElementsOutputState(position, dims);
  outputState.addNode(
    CollectionNodeMaker.makeElement({ id: nodeId, position }, dims, {
      ...dims.collection,
      collectionType: "trigger",
      onAddNode: () => stateUpdater.basic.trigger.addNode(null),
      nodes: nodes.map((node, index) =>
        makeCollectionNodeMakerChildProps(
          "trigger",
          node,
          index,
          stateUpdater,
          namer
        )
      ),
    })
  );
  return outputState;
};

export const makeConditionNodes: ElementMaker<AutomationCondition> = (
  nodes,
  { nodeId, stateUpdater, position, dims, namer, lastNodeId }
) => {
  const outputState = new DAGElementsOutputState(position, dims);
  outputState.addNode(
    CollectionNodeMaker.makeElement({ id: nodeId, position }, dims, {
      ...dims.collection,
      collectionType: "condition",
      hasInput: !!lastNodeId,
      onAddNode: () => stateUpdater.basic.condition.addNode(null),
      nodes: nodes.map((node, index) =>
        makeCollectionNodeMakerChildProps(
          "condition",
          node,
          index,
          stateUpdater,
          namer
        )
      ),
    })
  );
  if (lastNodeId && outputState.lastNodeId) {
    outputState.addEdge(lastNodeId, outputState.lastNodeId, { animated: true });
  }
  return outputState;
};

type MakeAddButtonArgs = {
  position: XYPosition;
  nodeId: string;
  outputState: DAGElementsOutputState;
  dims: DAGDims;
  onClick: () => void;
};
export const makeAddButton = (args: MakeAddButtonArgs) => {
  const addElement = args.outputState.addNode(
    ButtonNodeMaker.makeElement(
      {
        id: `${args.nodeId}-add-new`,
        position: args.position,
      },
      args.dims,
      {
        text: "Option",
        icon: <AddBox />,
        onClick: args.onClick,
      }
    )
  );
  args.outputState.addEdge(args.nodeId, addElement.id, {
    animated: true,
    sourceHandle: "side",
  });
};

type DrawConditionArgs = {
  conditions: AutomationCondition[];
  args: ElementMakerProps;
  onRemove: () => void;
};
export const drawCondition = ({
  conditions,
  onRemove,
  args,
}: DrawConditionArgs) => {
  const conditionState = makeConditionNodes(conditions, args);
  (conditionState.data.nodes[0].data as any).title = `Option ${
    args.nodeIndex + 1
  }`;

  (conditionState.data.nodes[0].data as any).onDelete = onRemove;
  conditionState.data.edges[0].sourceHandle = `side`;
  conditionState.data.edges[0].label = args.nodeIndex > 0 ? "else if" : "if";
  conditionState.data.edges[0].style = {
    stroke: "var(--mui-info-main)",
  };
  return conditionState;
};
