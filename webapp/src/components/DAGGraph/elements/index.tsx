import { DAGDims, ElementMaker, ElementMakerBaseProps } from "./types";
import { AutomationTrigger } from "types/automations/triggers";
import * as distance from "./distance";
import { getDescriptionFromAutomationNode } from "utils/formatting";
import {
  AutomationActionData,
  AutomationSequenceNode,
} from "types/automations";
import { AutomationCondition } from "types/automations/conditions";
import { CollectionNodeMaker } from "../nodes/CollectionNode";
import { XYPosition } from "react-flow-renderer";
import { DAGElementsOutputState } from "./outputState";
import { SequenceNodeMaker } from "../nodes/SequenceNode";
import {
  getNodeType,
  convertScriptConditionFieldToAutomationConditions,
} from "utils/automations";
import { ButtonNodeMaker } from "../nodes/ButtonNode";
import { AddIcon } from "components/Icons";
import { useDAGElementsState } from "./state";
import AddBox from "@mui/icons-material/AddBox";
import { DAGGraphChooseUpdater } from "../updater";
import { getSpecialNodeMaker, makeSpecialNodeMaker } from "./specialnodes";
import { getNodeSubType } from "../../../utils/automations";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Add from "@mui/icons-material/Add";

export const useAutomationNodes = (
  automation: AutomationActionData,
  args: ElementMakerBaseProps
) => {
  const dims: DAGDims = {
    ...args.dims,
  };
  const state = useDAGElementsState();
  const outputState = new DAGElementsOutputState(dims.position, dims);
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
        "collection",
        "collection",
        outputState.getLastNodePos(),
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
        "collection",
        "node",
        outputState.getLastNodePos(),
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
  const outputState = new DAGElementsOutputState(position, dims);
  outputState.addNode(
    CollectionNodeMaker.makeElement({ id: nodeId, position }, dims, {
      ...dims.collection,
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
  const outputState = new DAGElementsOutputState(position, dims);
  outputState.addNode(
    CollectionNodeMaker.makeElement({ id: nodeId, position }, dims, {
      ...dims.collection,
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
    outputState.addEdge(lastNodeId, outputState.lastNodeId, { animated: true });
  }
  return outputState;
};

export const makeSequenceNodes: ElementMaker<AutomationSequenceNode> = (
  nodes,
  args
) => {
  const { lastNodeId, position, dims, namer, stateUpdater, state } = args;
  const outputState = new DAGElementsOutputState(position, dims);
  nodes.forEach((node, nodeIndex) => {
    // the JSON.stringify is hack to make the edges render nicely
    const nodeId = `${args.nodeId}-${
      args.nodeIndex
    }-${nodeIndex}-${JSON.stringify(node)}`;
    outputState.incNextPos("node");
    const element = outputState.addNode(
      SequenceNodeMaker.makeElement(
        {
          id: nodeId,
          position: outputState.nextPos,
        },
        dims,
        {
          color: getNodeType(node) === "action" ? "green" : "blue",
          enabled: node.enabled ?? true,
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
    const specialNodeMaker = getSpecialNodeMaker(
      getNodeSubType(node, true) as any
    );
    if (specialNodeMaker) {
      outputState.extend(
        specialNodeMaker([node] as any, {
          ...args,
          nodeId,
          lastNodeId: element.id,
          position: outputState.getLastNodePos(),
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
        position: distance.moveAlong(
          "node",
          outputState.getLastNodePos(position),
          1,
          dims
        ),
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

export const makeChooseeNodes = makeSpecialNodeMaker(
  "choose",
  (node, outputState, args) => {
    // offset position
    let offsetPos: XYPosition = distance.offsetBy(
      "node",
      args.position,
      args.dims
    );
    let lastConditionState: DAGElementsOutputState | null = null;
    // functions
    const drawCondition = (
      { stateUpdater, onRemove }: DAGGraphChooseUpdater,
      position: XYPosition,
      lastNodeId: string | undefined,
      nodeIndex: number,
      conditions: AutomationCondition[]
    ) => {
      const conditionState = makeConditionNodes(conditions, {
        ...args,
        stateUpdater,
        position,
        lastNodeId,
        nodeIndex,
        nodeId: `${args.nodeId}-choose-${nodeIndex}-condition`,
      });
      lastConditionState = conditionState;
      (conditionState.data.nodes[0].data as any).title = `Option ${
        nodeIndex + 1
      }`;

      (conditionState.data.nodes[0].data as any).onDelete = onRemove;
      conditionState.data.edges[0].sourceHandle = `side`;
      conditionState.data.edges[0].label = `Option ${nodeIndex + 1}`;
      conditionState.data.edges[0].style = {
        stroke: "var(--mui-info-main)",
      };
      outputState.extend(conditionState);
      return conditionState;
    };
    const drawSequence = (
      { stateUpdater }: DAGGraphChooseUpdater,
      position: XYPosition,
      lastNodeId: string | undefined,
      nodeIndex: number,
      sequence: AutomationSequenceNode[],
      label: "else" | undefined
    ) => {
      const output = makeSequenceNodes(sequence, {
        ...args,
        stateUpdater,
        position,
        lastNodeId: undefined,
        nodeIndex,
        nodeId: `${args.nodeId}-choose-${nodeIndex}-sequence`,
      });
      if (lastNodeId && output.data.nodes.length > 0) {
        outputState.addEdge(lastNodeId, output.data.nodes[0].id, {
          animated: true,
          label,
          sourceHandle: label === "else" ? "side" : undefined,
          style: {
            stroke: "var(--mui-error-main)",
            zIndex: -1,
          },
        });
      }
      return output;
    };

    // process options
    for (let sIndex = 0; sIndex < node.choose.length; sIndex++) {
      const stateUpdater = args.stateUpdater.createChoosNodeUpdater(
        args.nodeIndex,
        sIndex
      );
      let pos = offsetPos;
      let lastNodeId = args.lastNodeId;
      const conditionState = drawCondition(
        stateUpdater,
        pos,
        lastNodeId,
        sIndex,
        node.choose[sIndex].conditions
      );
      pos = distance.moveFromTo("collection", "node", pos, args.dims);
      lastConditionState = conditionState;
      lastNodeId = conditionState.lastNodeId;
      const sequence = node.choose[sIndex].sequence;
      const output = drawSequence(
        stateUpdater,
        pos,
        lastNodeId,
        sIndex,
        sequence,
        undefined
      );
      offsetPos = distance.moveAlongRelativeTo(
        offsetPos,
        output.bbox[1],
        args.dims,
        "collection"
      );
      outputState.extend(output);
    }

    // else
    const stateUpdater = args.stateUpdater.createChoosNodeUpdater(
      args.nodeIndex,
      "else"
    );
    let pos = offsetPos;
    let lastNodeId = args.lastNodeId;
    const elseOutput = drawSequence(
      stateUpdater,
      pos,
      lastNodeId,
      node.choose.length,
      node.default ?? [],
      "else"
    );
    offsetPos = distance.moveAlongRelativeTo(
      offsetPos,
      elseOutput.bbox[1],
      args.dims,
      "node"
    );
    outputState.extend(elseOutput);

    // add btn
    let addPos = distance.moveAlong(
      "node",
      elseOutput.data.nodes[0].position,
      1 / args.dims.distanceFactor.node[0],
      args.dims,
      true
    );
    console.log({ addPos, lastConditionState });
    if (lastConditionState !== null) {
      addPos = distance.moveFromTo(
        "collection",
        "node",
        (lastConditionState as DAGElementsOutputState).nextPos,
        {
          ...args.dims,
          flipped: !args.dims.flipped,
        }
      );
    }
    const addElement = outputState.addNode(
      ButtonNodeMaker.makeElement(
        {
          id: `${args.nodeId}-choose-add-new`,
          position: addPos,
        },
        args.dims,
        {
          text: "Option",
          icon: <AddBox />,
          onClick: () =>
            args.stateUpdater.basic.sequence.updateNode(
              {
                ...node,
                choose: [
                  ...node.choose,
                  {
                    conditions: [],
                    sequence: [],
                  },
                ],
              },
              args.nodeIndex
            ),
        }
      )
    );
    outputState.addEdge(args.nodeId, addElement.id, {
      animated: true,
      sourceHandle: "side",
    });
  }
);

export const makeRepeatNodes = makeSpecialNodeMaker(
  "repeat",
  (node, outputState, args) => {
    // offset position
    let offsetPos: XYPosition = distance.offsetBy(
      "node",
      args.position,
      args.dims
    );
    let lastNodeId = args.lastNodeId;
    const stateUpdater = args.stateUpdater.createRepeatNodeUpdater(
      args.nodeIndex
    );

    let whileState: DAGElementsOutputState | null = null;
    let untilState: DAGElementsOutputState | null = null;

    // while
    if ("while" in node.repeat) {
      whileState = makeConditionNodes(
        convertScriptConditionFieldToAutomationConditions(node.repeat.while),
        {
          ...args,
          stateUpdater: stateUpdater,
          position: offsetPos,
          lastNodeId,
          nodeIndex: 0,
          nodeId: `${args.nodeId}-repeat-while`,
        }
      );
      whileState.data.edges[0].sourceHandle = `side`;
      whileState.data.edges[0].label = `While`;
      outputState.extend(whileState);
      offsetPos = distance.moveFromTo(
        "collection",
        "node",
        offsetPos,
        args.dims
      );
      lastNodeId = whileState.lastNodeId;
    }
    // sequence
    const sequenceState = makeSequenceNodes(node.repeat.sequence, {
      ...args,
      stateUpdater: stateUpdater,
      position: offsetPos,
      lastNodeId: undefined,
      nodeIndex: 0,
      nodeId: `${args.nodeId}-repeat-sequence`,
    });
    if (lastNodeId && sequenceState.data.nodes.length > 0) {
      outputState.addEdge(lastNodeId, sequenceState.data.nodes[0].id, {
        animated: true,
        label:
          "count" in node.repeat
            ? `repeat ${node.repeat.count} time${
                node.repeat.count !== 1 ? "s" : ""
              }`
            : "do",
      });
    }
    lastNodeId = sequenceState.lastNodeId;
    offsetPos = distance.moveAlongRelativeTo(
      offsetPos,
      sequenceState.bbox[1],
      args.dims,
      "node"
    );
    // until
    if ("until" in node.repeat) {
      untilState = makeConditionNodes(
        convertScriptConditionFieldToAutomationConditions(node.repeat.until),
        {
          ...args,
          stateUpdater: stateUpdater,
          position: offsetPos,
          lastNodeId,
          nodeIndex: 0,
          nodeId: `${args.nodeId}-repeat-until`,
        }
      );
      untilState.data.edges[0].label = `Until`;
      untilState.data.edges[0].targetHandle = `side`;
      outputState.extend(untilState);
      offsetPos = distance.moveFromTo(
        "collection",
        "node",
        offsetPos,
        args.dims
      );
      lastNodeId = untilState.lastNodeId;
    }
    // loop
    const firstNodeId =
      whileState === null
        ? sequenceState.data.nodes[0].id
        : whileState.lastNodeId;
    const finalNodeId =
      untilState === null ? sequenceState.lastNodeId : untilState.lastNodeId;
    if (finalNodeId && firstNodeId) {
      outputState.addEdge(finalNodeId, firstNodeId, {
        animated: true,
        label: "repeat",
        sourceHandle: untilState === null ? "default" : "head",
        targetHandle: "return",
      });
    }
    outputState.extend(sequenceState);
  }
);

export const makeParallelNodes = makeSpecialNodeMaker(
  "parallel",
  (node, outputState, args) => {
    const offsetPos = distance.moveAlong("node", args.position, 0.5, args.dims);
    for (let sIndex = 0; sIndex < node.parallel.length; sIndex++) {
      const { stateUpdater, onRemove } =
        args.stateUpdater.createParallelNodeUpdater(args.nodeIndex, sIndex);
      const element = node.parallel[sIndex];
      const deleteBtn = ButtonNodeMaker.makeElement(
        {
          id: `${args.nodeId}-${sIndex}-delete`,
          position: distance.moveAlong(
            "node",
            offsetPos,
            sIndex + 1,
            args.dims,
            true
          ),
        },
        args.dims,
        {
          icon: <DeleteForeverIcon />,
          onClick: onRemove,
        }
      );
      outputState.addNode(deleteBtn);
      outputState.addEdge(args.nodeId, deleteBtn.id, {
        sourceHandle: "side",
        animated: true,
      });
      const sequence = "sequence" in element ? element.sequence : [element];
      const sequenceState = makeSequenceNodes(sequence, {
        ...args,
        stateUpdater,
        lastNodeId: deleteBtn.id,
        nodeIndex: sIndex,
        nodeId: `${args.nodeId}-${sIndex}`,
        position: distance.moveAlong("node", deleteBtn.position, 1, args.dims),
      });
      sequenceState.data.edges[0].sourceHandle = "next";
      outputState.extend(sequenceState);
    }
    const addBtn = ButtonNodeMaker.makeElement(
      {
        id: `${args.nodeId}-add`,
        position: distance.moveAlong(
          "node",
          offsetPos,
          node.parallel.length + 1,
          args.dims,
          true
        ),
      },
      args.dims,
      {
        icon: <Add />,
        onClick: () =>
          args.stateUpdater.basic.sequence.updateNode(
            {
              ...node,
              parallel: [
                ...node.parallel,
                {
                  sequence: [],
                },
              ],
            },
            args.nodeIndex
          ),
      }
    );
    outputState.addNode(addBtn);
    outputState.addEdge(args.nodeId, addBtn.id, {
      animated: true,
      sourceHandle: "side",
    });
  }
);
