import {
  Bbox,
  ElementMaker,
  ElementMakerBaseProps,
  ElementMakerOutput,
} from "./types";
import { AutomationTrigger } from "types/automations/triggers";
import { SequenceNodeMaker } from "../nodes/SequenceNode";
import * as distance from "./distance";
import { getDescriptionFromAutomationNode } from "utils/formatting";
import { AutomationActionData } from "types/automations";
import { AutomationCondition } from "types/automations/conditions";
import { pointApply, updateBBox } from "./math";

export const makeAutomationNodes = (
  automation: AutomationActionData,
  args: ElementMakerBaseProps
) => {
  let state: ElementMakerOutput = {
    elementData: {
      nodes: [],
      edges: [],
    },
    bbox: [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
  };
  console.log(args);
  state = makeTriggerNodes(automation.trigger, {
    ...args,
    elementData: state.elementData,
    position: state.bbox[0],
    nodeId: "trigger",
    nodeIndex: 0,
  });

  console.log(state);
  const conditionStartPoint = pointApply(...state.bbox, (a, b) => (a + b) / 2);
  if (args.dims.flipped) {
    conditionStartPoint.y += args.dims.node.height * args.dims.distanceFactor;
  } else {
    conditionStartPoint.x += args.dims.node.width * args.dims.distanceFactor;
  }

  const condOut = makeConditionNodes(automation.condition, {
    ...args,
    elementData: state.elementData,
    position: pointApply(...state.bbox, (a, b) => (a + b) / 2),
    nodeId: "condition",
    nodeIndex: 0,
  });

  console.log(condOut);

  return condOut.elementData;
};

export const makeTriggerNodes: ElementMaker<AutomationTrigger> = (
  nodes,
  {
    elementData,
    dims,
    namer,
    openModal,
    stateUpdater,
    nodeId,
    nodeIndex,
    position,
  }
) => {
  let bbox: Bbox = [position, position];
  nodes.forEach((node, index) => {
    const element = SequenceNodeMaker.makeElement(
      {
        id: `${nodeId}-${nodeIndex}-${index}`,
        position: distance.moveAlong("node", position, index, dims),
      },
      dims,
      {
        color: "red",
        enabled: node.enabled ?? true,
        label: getDescriptionFromAutomationNode(node, namer, true),
        onSetEnabled: () => stateUpdater.basic.trigger.setEnabled(index),
        onEditClick: () =>
          openModal({
            allowedTypes: ["trigger"],
            node: node,
            update: (n) => stateUpdater.basic.trigger.updateNode(n, index),
          }),
      }
    );
    elementData.nodes.push(element);
    bbox = updateBBox(bbox, element.position, dims.node);
  });

  return {
    elementData,
    bbox,
  };
};

export const makeConditionNodes: ElementMaker<AutomationCondition> = (
  nodes,
  { elementData, nodeId, nodeIndex, position, dims, namer }
) => {
  let bbox: Bbox = [position, position];

  nodes.forEach((node, index) => {
    const element = SequenceNodeMaker.makeElement(
      {
        id: `${nodeId}-${nodeIndex}-${index}`,
        position: distance.moveAlong(
          "condition",
          position,
          index,
          dims,
          "under"
        ),
      },
      dims,
      {
        color: "blue",
        enabled: node.enabled ?? true,
        label: getDescriptionFromAutomationNode(node, namer, true),
      }
    );
    elementData.nodes.push(element);
    bbox = updateBBox(bbox, element.position, dims.condition);
  });

  return {
    elementData,
    bbox,
  };
};
