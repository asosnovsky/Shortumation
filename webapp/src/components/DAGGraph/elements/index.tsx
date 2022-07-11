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
import { DAGElementsState } from "./state";
import { SequenceNodeMaker } from "../nodes/SequenceNode";
import { getNodeType } from "utils/automations";
import { pointApply } from "./math";
import { ButtonNodeMaker } from "../nodes/ButtonNode";
import { AddIcon } from "components/Icons";

export const makeAutomationNodes = (
  automation: AutomationActionData,
  args: ElementMakerBaseProps
) => {
  const dims: DAGDims = {
    ...args.dims,
    // think of a better to do this
    // condition: args.dims.flipped
    //   ? args.dims.condition
    //   : {
    //       height: args.dims.condition.width,
    //       width: args.dims.condition.height,
    //     },
    // trigger: args.dims.flipped
    //   ? args.dims.trigger
    //   : {
    //       height: args.dims.trigger.width,
    //       width: args.dims.trigger.height,
    //     },
  };
  const state = new DAGElementsState();
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
  const state = new DAGElementsState();
  state.addNode(
    CollectionNodeMaker.makeElement({ id: nodeId, position }, dims, {
      ...dims.trigger,
      color: "red",
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
  const state = new DAGElementsState();
  state.addNode(
    CollectionNodeMaker.makeElement({ id: nodeId, position }, dims, {
      ...dims.condition,
      color: "blue",
      hasInput: !!lastNodeId,
      onAddNode: () => stateUpdater.basic.condition.addNode(null),
      nodes: nodes.map((node, index) => ({
        enabled: node.enabled ?? true,
        label: getDescriptionFromAutomationNode(node, namer, true),
        ...stateUpdater.createNodeActions("condition", index, {}),
      })),
    })
  );
  if (lastNodeId && state.lastNodeId) {
    state.addEdge(lastNodeId, state.lastNodeId, true);
  }
  return state;
};

export const makeSequenceNodes: ElementMaker<AutomationSequenceNode> = (
  nodes,
  args
) => {
  const state = new DAGElementsState();
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
  const state = new DAGElementsState();

  nodes.forEach((node, nodeIndex) => {
    if (node.enabled ?? true) {
      // offset position
      let offsetPos: XYPosition = {
        x:
          args.position.x +
          args.dims.distanceFactor.node *
            args.dims.node.width *
            (nodeIndex + 1),
        y:
          args.position.y +
          args.dims.distanceFactor.node *
            args.dims.node.height *
            (nodeIndex + 1),
      };
      // functions
      const processSequence = (
        sequence: AutomationSequenceNode[],
        index: number,
        condition: AutomationCondition[] | null = null
      ) => {
        let pos = offsetPos;
        let lastNodeId = args.lastNodeId;
        // if (condition !== null) {
        //   const conditionState = makeConditionNodes(condition, {
        //     ...args,
        //     position: pos,
        //     lastNodeId,
        //     nodeIndex: index,
        //     nodeId: `${args.nodeId}-choose-${index}-condition`,
        //   });
        //   // pos.y = conditionState.bbox[1].y;
        //   state.extend(conditionState);
        //   if (lastNodeId && conditionState.data.nodes.length > 0) {
        //     state.addEdge(lastNodeId, conditionState.data.nodes[0].id, true);
        //   }
        //   lastNodeId = conditionState.lastNodeId ?? lastNodeId;
        //   pos = {
        //     y: conditionState.bbox[1].y,
        //     x: pos.x,
        //   };
        // }
        const output = makeSequenceNodes(sequence, {
          ...args,
          position: pos,
          lastNodeId: undefined,
          nodeIndex: index,
          nodeId: `${args.nodeId}-choose-${index}-sequence`,
        });
        if (lastNodeId && output.data.nodes.length > 0) {
          state.addEdge(lastNodeId, output.data.nodes[0].id, true);
        }
        offsetPos = args.dims.flipped
          ? {
              x:
                output.bbox[1].x +
                (args.dims.distanceFactor.node - 1) * args.dims.node.width,
              y: offsetPos.y,
            }
          : {
              y:
                output.bbox[1].y +
                (args.dims.distanceFactor.node - 1) * args.dims.node.height,
              x: offsetPos.x,
            };
        state.extend(output);
      };

      // process options
      for (let sIndex = 0; sIndex < node.choose.length; sIndex++) {
        const subSequence = node.choose[sIndex];
        processSequence(subSequence.sequence, sIndex, subSequence.conditions);
      }
      // else
      processSequence(node.default ?? [], node.choose.length);
    }
  });

  return state;
};
