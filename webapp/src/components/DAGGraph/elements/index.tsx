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

export const makeAutomationNodes = (
  automation: AutomationActionData,
  args: ElementMakerBaseProps
) => {
  const dims: DAGDims = {
    ...args.dims,
  };
  const state = new DAGElementsOutputState();
  state.extend(
    makeTriggerNodes(automation.trigger, {
      ...args,
      dims,
      position: dims.position,
      nodeId: `${dims.flipped}-trigger`,
      nodeIndex: 0,
    })
  );

  state.extend(
    makeConditionNodes(automation.condition, {
      ...args,
      dims,
      position: distance.moveFromTo(
        "trigger",
        "condition",
        state.lastNodePos,
        dims
      ),
      nodeId: `${dims.flipped}-condition`,
      nodeIndex: 1,
      lastNodeId: state.lastNodeId,
    })
  );

  state.extend(
    makeSequenceNodes(automation.sequence, {
      ...args,
      dims,
      position: distance.moveFromTo(
        "condition",
        "node",
        state.lastNodePos,
        dims
      ),
      nodeId: `${dims.flipped}-sequence`,
      nodeIndex: 2,
      lastNodeId: state.lastNodeId,
    })
  );

  return state.data;
};

export const makeTriggerNodes: ElementMaker<AutomationTrigger> = (
  nodes,
  { dims, namer, stateUpdater, nodeId, position }
) => {
  const state = new DAGElementsOutputState();
  state.addNode(
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
  return state;
};

export const makeConditionNodes: ElementMaker<AutomationCondition> = (
  nodes,
  { nodeId, stateUpdater, position, dims, namer, lastNodeId }
) => {
  const state = new DAGElementsOutputState();
  state.addNode(
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
  console.log("pre", { lastNodeId, stateLast: state.lastNodeId });
  if (lastNodeId && state.lastNodeId) {
    state.addEdge(lastNodeId, state.lastNodeId, true);
  }
  return state;
};

export const makeSequenceNodes: ElementMaker<AutomationSequenceNode> = (
  nodes,
  args
) => {
  const state = new DAGElementsOutputState();
  const { lastNodeId, nodeId, position, dims, namer, stateUpdater } = args;
  nodes.forEach((node, nodeIndex) => {
    const element = state.addNode(
      SequenceNodeMaker.makeElement(
        {
          // the JSON.stringify is hack to make the edges render nicely
          id: `${nodeId}-${args.nodeIndex}-${nodeIndex}-${JSON.stringify(
            node
          )}`,
          position: distance.moveAlong("node", position, nodeIndex, dims),
        },
        dims,
        {
          color: getNodeType(node) === "action" ? "green" : "blue",
          enabled: node.enabled ?? true,
          hasInput: true,
          label: getDescriptionFromAutomationNode(node, namer, true),
          ...stateUpdater.createNodeActions("sequence", nodeIndex, {
            includeAdd: true,
            flipped: dims.flipped,
          }),
        }
      ),
      true
    );
    if (nodeIndex === 0 && lastNodeId) {
      state.addEdge(lastNodeId, element.id);
    }
    if ("choose" in node) {
      state.extend(
        makeChooseeNodes([node], {
          ...args,
          lastNodeId: element.id,
          position: state.lastNodePos,
          nodeIndex,
        }),
        true
      );
    }
  });

  const addElement = state.addNode(
    ButtonNodeMaker.makeElement(
      {
        id: `${nodeId}-add-new`,
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
    state.addEdge(lastNodeId, addElement.id);
  }

  return state;
};

export const makeChooseeNodes: ElementMaker<ChooseAction> = (nodes, args) => {
  const state = new DAGElementsOutputState();
  if (nodes.length !== 1) {
    throw new Error("makeChooseNodes only access a list of 1");
  }
  const node = nodes[0];
  if (node.enabled ?? true) {
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
        state.extend(conditionState);
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
        state.addEdge(
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
      state.extend(output);
    };

    // process options
    for (let sIndex = 0; sIndex < node.choose.length; sIndex++) {
      processSequence(sIndex);
    }
    // else
    processSequence("else");
  }

  return state;
};
