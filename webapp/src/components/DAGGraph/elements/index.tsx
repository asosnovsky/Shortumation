import {
  DAGDims,
  ElementData,
  ElementMaker,
  ElementMakerBaseProps,
  LastNode,
} from "./types";
import { AutomationTrigger } from "types/automations/triggers";
import * as distance from "./distance";
import { getDescriptionFromAutomationNode } from "utils/formatting";
import {
  AutomationActionData,
  AutomationSequenceNode,
} from "types/automations";
import { AutomationCondition } from "types/automations/conditions";
import { CollectionNodeMaker } from "../nodes/CollectionNode";
import { ChooseAction } from "types/automations/actions";
import { XYPosition } from "react-flow-renderer";
import { DAGElementsOutputState } from "./outputState";
import { SequenceNodeMaker } from "../nodes/SequenceNode";
import { getNodeType } from "utils/automations";
import { ButtonNodeMaker } from "../nodes/ButtonNode";
import { AddIcon } from "components/Icons";
import { useDAGElementsState } from "./state";

export const useAutomationNodes = (
  automation: AutomationActionData,
  args: ElementMakerBaseProps
) => {
  const dims: DAGDims = {
    ...args.dims,
  };
  const state = useDAGElementsState();
  const outputState = new DAGElementsOutputState();
  outputState.extend(
    makeTriggerNodes(automation.trigger, {
      ...args,
      state,
      dims,
      position: dims.position,
      nodeId: `${dims.flipped}-trigger`,
      nodeIndex: 0,
    })
  );

  outputState.extend(
    makeConditionNodes(automation.condition, {
      ...args,
      state,
      dims,
      position: distance.moveFromTo(
        "trigger",
        "condition",
        outputState.lastNodePos,
        dims
      ),
      nodeId: `${dims.flipped}-condition`,
      nodeIndex: 1,
      lastNodeId: outputState.lastNodeId,
    })
  );

  outputState.extend(
    makeSequenceNodes(automation.sequence, {
      ...args,
      state,
      dims,
      position: distance.moveFromTo(
        "condition",
        "node",
        outputState.lastNodePos,
        dims
      ),
      nodeId: `${dims.flipped}-sequence`,
      nodeIndex: 2,
      lastNodeId: outputState.lastNodeId,
    })
  );

  return outputState.data;
};

export const makeTriggerNodes: ElementMaker<AutomationTrigger> = (
  nodes,
  { dims, namer, stateUpdater, nodeId, position }
) => {
  const outputState = new DAGElementsOutputState();
  outputState.addNode(
    CollectionNodeMaker.makeElement({ id: nodeId, position }, dims, {
      ...dims.trigger,
      collectionType: "trigger",
      onAddNode: () => stateUpdater.basic.trigger.addNode(null),
      nodes: nodes.map((node, index) => ({
        enabled: node.enabled ?? true,
        label: getDescriptionFromAutomationNode(node, namer, true),
        ...stateUpdater.createNodeActions("trigger", index, {}),
      })),
    })
  );
  return outputState;
};

export const makeConditionNodes: ElementMaker<AutomationCondition> = (
  nodes,
  { nodeId, stateUpdater, position, dims, namer, lastNodeId }
) => {
  const outputState = new DAGElementsOutputState();
  outputState.addNode(
    CollectionNodeMaker.makeElement({ id: nodeId, position }, dims, {
      ...dims.condition,
      collectionType: "condition",
      hasInput: !!lastNodeId,
      onAddNode: () => stateUpdater.basic.condition.addNode(null),
      nodes: nodes.map((node, index) => ({
        enabled: node.enabled ?? true,
        label: getDescriptionFromAutomationNode(node, namer, true),
        ...stateUpdater.createNodeActions("condition", index, {}),
      })),
    })
  );
  if (lastNodeId && outputState.lastNodeId) {
    outputState.addEdge(lastNodeId, outputState.lastNodeId, true);
  }
  return outputState;
};

export const makeSequenceNodes: ElementMaker<AutomationSequenceNode> = (
  nodes,
  args
) => {
  const outputState = new DAGElementsOutputState();
  const { lastNodeId, position, dims, namer, stateUpdater, state } = args;
  nodes.forEach((node, nodeIndex) => {
    // the JSON.stringify is hack to make the edges render nicely
    const nodeId = `${args.nodeId}-${
      args.nodeIndex
    }-${nodeIndex}-${JSON.stringify(node)}`;
    const element = outputState.addNode(
      SequenceNodeMaker.makeElement(
        {
          id: nodeId,
          position: distance.moveAlong("node", position, nodeIndex, dims),
        },
        dims,
        {
          color: getNodeType(node) === "action" ? "green" : "blue",
          enabled: node.enabled ?? true,
          hasInput: true,
          label: getDescriptionFromAutomationNode(node, namer, true),
          ...state.getIsClosedActions(nodeId, node),
          ...stateUpdater.createNodeActions("sequence", nodeIndex, {
            includeAdd: true,
            flipped: dims.flipped,
          }),
        }
      ),
      true
    );
    if (nodeIndex === 0 && lastNodeId) {
      outputState.addEdge(lastNodeId, element.id);
    }
    if ("choose" in node) {
      outputState.extend(
        makeChooseeNodes([node], {
          ...args,
          lastNodeId: element.id,
          position: outputState.lastNodePos,
          nodeIndex,
        }),
        true
      );
    }
  });

  const addElement = outputState.addNode(
    ButtonNodeMaker.makeElement(
      {
        id: `${args.nodeId}-add-new`,
        position: distance.moveAlong("node", position, nodes.length, dims),
      },
      dims,
      {
        icon: <AddIcon />,
        onClick: () => stateUpdater.basic.sequence.addNode(null),
      }
    ),
    true
  );

  if (nodes.length === 0 && lastNodeId) {
    outputState.addEdge(lastNodeId, addElement.id);
  }

  return outputState;
};

export const makeChooseeNodes: ElementMaker<ChooseAction> = (nodes, args) => {
  const outputState = new DAGElementsOutputState();
  if (nodes.length !== 1) {
    throw new Error("makeChooseNodes only access a list of 1");
  }
  const node = nodes[0];
  if (
    (node.enabled ?? true) &&
    !args.state.get(args.lastNodeId ?? "").isClosed
  ) {
    // offset position
    let offsetPos: XYPosition = {
      x: args.position.x + args.dims.distanceFactor.node * args.dims.node.width,
      y:
        args.position.y + args.dims.distanceFactor.node * args.dims.node.height,
    };
    // functions
    const processSequence = (j: number | "else") => {
      const stateUpdater = args.stateUpdater.createChoosNodeUpdater(
        args.nodeIndex,
        j
      );
      let pos = offsetPos;
      let lastNodeId = args.lastNodeId;
      if (j !== "else") {
        const conditionState = makeConditionNodes(node.choose[j].conditions, {
          ...args,
          stateUpdater,
          position: pos,
          lastNodeId,
          nodeIndex: j,
          nodeId: `${args.nodeId}-choose-${j}-condition`,
        });
        conditionState.data.edges[0].label = `Condition #${j}`;
        outputState.extend(conditionState);
        pos = distance.moveFromTo("condition", "node", pos, args.dims);
        lastNodeId = conditionState.lastNodeId;
      }
      const sequence =
        j === "else" ? node.default ?? [] : node.choose[j].sequence;
      const output = makeSequenceNodes(sequence, {
        ...args,
        stateUpdater,
        position: pos,
        lastNodeId: undefined,
        nodeIndex: j === "else" ? node.choose.length : j,
        nodeId: `${args.nodeId}-choose-${j}-sequence`,
      });
      if (lastNodeId && output.data.nodes.length > 0) {
        outputState.addEdge(
          lastNodeId,
          output.data.nodes[0].id,
          true,
          j === "else" ? "else" : undefined
        );
      }
      offsetPos = distance.moveAlongRelativeTo(
        offsetPos,
        output.bbox[1],
        args.dims,
        j === "else" ? "node" : "condition"
      );
      outputState.extend(output);
    };

    // process options
    for (let sIndex = 0; sIndex < node.choose.length; sIndex++) {
      processSequence(sIndex);
    }
    // else
    processSequence("else");
  }

  return outputState;
};
