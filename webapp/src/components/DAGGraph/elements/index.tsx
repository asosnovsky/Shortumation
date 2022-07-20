import { DAGDims, ElementMaker, ElementMakerBaseProps } from "./types";
import * as distance from "./distance";
import { getDescriptionFromAutomationNode } from "utils/formatting";
import {
  AutomationActionData,
  AutomationSequenceNode,
} from "types/automations";
import { AutomationCondition } from "types/automations/conditions";
import { XYPosition } from "react-flow-renderer";
import { DAGElementsOutputState } from "./outputState";
import { SequenceNodeMaker } from "../nodes/SequenceNode";
import {
  getNodeType,
  convertScriptConditionFieldToAutomationConditions,
  validateNode,
} from "utils/automations";
import { ButtonNodeMaker } from "../nodes/ButtonNode";
import { AddIcon } from "components/Icons";
import { useDAGElementsState } from "./state";
import { DAGGraphChooseUpdater } from "../updater";
import { getSpecialNodeMaker, makeSpecialNodeMaker } from "./specialnodes";
import { getNodeSubType } from "../../../utils/automations";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Add from "@mui/icons-material/Add";
import { SequenceNodeDataProps } from "../nodes/SequenceNode/types";
import { convertFailuresToSequenceNodeDataProps } from "./util";
import { convertChooseActionToOrignal } from "../updater/util";
import * as helpers from "./helpers";

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
    helpers.makeTriggerNodes(automation.trigger, {
      ...args,
      state,
      dims,
      position: dims.position,
      nodeId: `${dims.flipped}-trigger`,
      nodeIndex: 0,
    })
  );
  outputState.extend(
    helpers.makeConditionNodes(automation.condition, {
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
        dims,
        true
      ),
      nodeId: `${dims.flipped}-sequence`,
      nodeIndex: 2,
      lastNodeId: outputState.lastNodeId,
    })
  );

  return outputState.data;
};

export const makeSequenceNodes: ElementMaker<AutomationSequenceNode> = (
  nodes,
  args
) => {
  const { lastNodeId, position, dims, namer, stateUpdater, state } = args;
  const outputState = new DAGElementsOutputState(position, dims);
  nodes.forEach((node, nodeIndex) => {
    // the JSON.stringify is hack to make the edges render nicely
    outputState.incNextPos("node");
    const nodeId = `${args.nodeId}-${args.nodeIndex}-${nodeIndex}`;
    let nodeData: SequenceNodeDataProps = {
      color: getNodeType(node) === "action" ? "green" : "blue",
      enabled: node.enabled ?? true,
      label: getDescriptionFromAutomationNode(node, namer, true),
      ...state.getIsClosedActions(nodeId, node),
      ...stateUpdater.createNodeActions("sequence", nodeIndex, {
        includeAdd: true,
        flipped: dims.flipped,
      }),
    };
    const failures = validateNode(node, ["action", "condition"]);
    if (failures) {
      nodeData = {
        ...nodeData,
        ...convertFailuresToSequenceNodeDataProps(failures),
      };
    }
    const element = outputState.addNode(
      SequenceNodeMaker.makeElement(
        {
          id: nodeId,
          position: outputState.nextPos,
        },
        dims,
        nodeData
      ),
      true
    );
    if (nodeIndex === 0 && lastNodeId) {
      outputState.addEdge(lastNodeId, element.id);
    }
    if (!failures) {
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
    }
    outputState.incNextPos("node");
  });

  const addElement = outputState.addNode(
    ButtonNodeMaker.makeElement(
      {
        id: `${args.nodeId}-add-new`,
        position: outputState.nextPos,
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
  (incmNode, outputState, args) => {
    const node = convertChooseActionToOrignal(incmNode);
    // offset position
    let pos: XYPosition = distance.offsetBy("node", args.position, args.dims);
    let lastConditionState: DAGElementsOutputState | null = null;
    // functions
    const drawSequence = (
      { stateUpdater }: DAGGraphChooseUpdater,
      position: XYPosition,
      lastNodeId: string | undefined,
      nodeIndex: number,
      sequence: AutomationSequenceNode[],
      isElse: boolean = false
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
          label: isElse ? "else" : "then",
          sourceHandle: isElse ? "side" : undefined,
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
      const { stateUpdater, onRemove } =
        args.stateUpdater.createChoosNodeUpdater(args.nodeIndex, sIndex);
      // let pos = offsetPos;
      let lastNodeId = args.lastNodeId;
      const conditionState = helpers.drawCondition({
        conditions: node.choose[sIndex].conditions,
        onRemove,
        args: {
          ...args,
          stateUpdater,
          position: pos,
          lastNodeId,
          nodeIndex: sIndex,
          nodeId: `${args.nodeId}-choose-${sIndex}-condition`,
        },
      });
      outputState.extend(conditionState);
      lastConditionState = conditionState;
      lastNodeId = conditionState.lastNodeId;
      const sequence = node.choose[sIndex].sequence;
      const output = drawSequence(
        { stateUpdater, onRemove },
        distance.moveFromTo("collection", "node", pos, args.dims),
        lastNodeId,
        sIndex,
        sequence,
        undefined
      );
      pos = distance.moveAlongRelativeTo(
        pos,
        output.bbox[1],
        args.dims,
        "collection"
      );
      outputState.extend(output);
    }

    // add btn
    if (lastConditionState !== null) {
      pos = distance.moveFromTo(
        "collection",
        "node",
        (lastConditionState as DAGElementsOutputState).nextPos,
        {
          ...args.dims,
          flipped: !args.dims.flipped,
        }
      );
    }
    helpers.makeAddButton({
      outputState,
      dims: args.dims,
      nodeId: args.nodeId,
      position: pos,
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
    });

    // else
    const stateUpdater = args.stateUpdater.createChoosNodeUpdater(
      args.nodeIndex,
      "else"
    );
    let lastNodeId = args.lastNodeId;
    const elseOutput = drawSequence(
      stateUpdater,
      distance.moveAlong("node", pos, 1, args.dims, true),
      lastNodeId,
      node.choose.length,
      node.default ?? [],
      true
    );
    outputState.extend(elseOutput);
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
      whileState = helpers.makeConditionNodes(
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
      untilState = helpers.makeConditionNodes(
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
          args.openModal({
            allowedTypes: ["condition", "action"],
            node: args.stateUpdater.basic.sequence.defaultNode,
            saveBtnCreateText: true,
            update: (n) =>
              args.stateUpdater.basic.sequence.updateNode(
                {
                  ...node,
                  parallel: [...node.parallel, n],
                },
                args.nodeIndex
              ),
          }),
      }
    );
    outputState.addNode(addBtn);
    outputState.addEdge(args.nodeId, addBtn.id, {
      animated: true,
      sourceHandle: "side",
    });
  }
);
