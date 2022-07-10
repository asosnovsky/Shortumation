import {
  Bbox,
  ElementMaker,
  ElementMakerBaseProps,
  ElementMakerOutput,
} from "./types";
import { AutomationTrigger } from "types/automations/triggers";
import * as distance from "./distance";
import { getDescriptionFromAutomationNode } from "utils/formatting";
import { AutomationActionData } from "types/automations";
import { AutomationCondition } from "types/automations/conditions";
import { CollectionNodeMaker } from "../nodes/CollectionNode";

export const makeAutomationNodes = (
  automation: AutomationActionData,
  args: ElementMakerBaseProps
) => {
  let state: ElementMakerOutput = makeTriggerNodes(automation.trigger, {
    ...args,
    elementData: {
      nodes: [],
      edges: [],
    },
    position: args.dims.position,
    nodeId: `${args.dims.flipped}-trigger`,
    nodeIndex: 0,
  });

  const condOut = makeConditionNodes(automation.condition, {
    ...args,
    elementData: state.elementData,
    position: distance.moveFromTo(
      "trigger",
      "condition",
      state.lastNode.pos,
      args.dims
    ),
    nodeId: `${args.dims.flipped}-condition`,
    nodeIndex: 1,
    lastNodeId: state.lastNode.nodeId,
  });

  return condOut.elementData;
};

export const makeTriggerNodes: ElementMaker<AutomationTrigger> = (
  nodes,
  { elementData, dims, namer, openModal, stateUpdater, nodeId, position }
) => {
  elementData.nodes.push(
    CollectionNodeMaker.makeElement({ id: nodeId, position }, dims, {
      ...dims.trigger,
      color: "red",
      onAddNode: () => stateUpdater.basic.trigger.addNode(),
      nodes: nodes.map((node, index) => ({
        enabled: node.enabled ?? true,
        label: getDescriptionFromAutomationNode(node, namer, true),
        ...stateUpdater.createNodeActions("trigger", index, {
          flipped: dims.flipped,
        }),
      })),
    })
  );
  return {
    elementData,
    lastNode: {
      nodeId,
      pos: elementData.nodes[elementData.nodes.length - 1].position,
      size: dims.trigger,
    },
  };
};

export const makeConditionNodes: ElementMaker<AutomationCondition> = (
  nodes,
  {
    elementData,
    nodeId,
    stateUpdater,
    position,
    dims,
    namer,
    openModal,
    lastNodeId,
  }
) => {
  elementData.nodes.push(
    CollectionNodeMaker.makeElement({ id: nodeId, position }, dims, {
      ...dims.condition,
      color: "blue",
      hasInput: !!lastNodeId,
      onAddNode: stateUpdater.basic.condition.addNode,
      nodes: nodes.map((node, index) => ({
        enabled: node.enabled ?? true,
        label: getDescriptionFromAutomationNode(node, namer, true),
        ...stateUpdater.createNodeActions("condition", index, {
          flipped: dims.flipped,
        }),
      })),
    })
  );
  if (lastNodeId) {
    elementData.edges.push({
      source: lastNodeId,
      target: elementData.nodes[elementData.nodes.length - 1].id,
      id: `${lastNodeId}->${
        elementData.nodes[elementData.nodes.length - 1].id
      }`,
    });
  }
  return {
    elementData,
    lastNode: {
      nodeId,
      pos: elementData.nodes[elementData.nodes.length - 1].position,
      size: dims.trigger,
    },
  };
};
