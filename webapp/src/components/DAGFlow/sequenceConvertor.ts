import { AutomationSequenceNode } from "types/automations";
import { DAGAutomationFlowDims, FlowData } from "./types";
import { getDescriptionFromAutomationNode, Namer } from "utils/formatting";
import { XYPosition } from "react-flow-renderer";
import { ChooseAction } from "types/automations/actions";
import { makeFlowCircle } from "./DAGCircle";
import { createOnRemoveForChooseNode, SequenceUpdater } from "./updater";
import { getNodeType } from "utils/automations";
import { makeAddButton } from "./flowDataMods";
import {
  makeActionPoint,
  makeConditionPoint,
  DAGNodeOnMoveEvents,
} from "./DAGNode";

export const sequenceToFlow = (
  flowData: FlowData,
  sequence: AutomationSequenceNode[],
  fromPoint: string,
  dims: DAGAutomationFlowDims,
  namer: Namer,
  updater: SequenceUpdater,
  prefix: string = ""
) => {
  let lastPointId = fromPoint;
  let lasPos: XYPosition | null = null;
  // sequence
  for (let i = 0; i < sequence.length; i++) {
    const node = sequence[i];
    const nodeId = `${prefix}n-${i}`;
    let position: XYPosition;
    if (lasPos) {
      position = dims.flipped
        ? {
            y: lasPos.y + dims.nodeHeight * dims.distanceFactor,
            x: dims.padding.x,
          }
        : {
            x: lasPos.x + dims.nodeWidth * dims.distanceFactor,
            y: dims.padding.y,
          };
    } else {
      position = dims.flipped
        ? {
            y: dims.padding.y + dims.nodeHeight * dims.distanceFactor * (i + 2),
            x: dims.padding.x,
          }
        : {
            x: dims.padding.x + dims.nodeWidth * dims.distanceFactor * (i + 2),
            y: dims.padding.y,
          };
    }
    // draw node
    if (getNodeType(node) === "action") {
      if ("choose" in node) {
        try {
          const out = addChooseNode(
            node,
            position,
            nodeId,
            dims,
            namer,
            updater,
            i
          );
          position = out.lastPos;
          flowData = mergeFlowDatas(flowData, out.flowData);
        } catch (err) {
          console.error(err);
          addErrorNode(
            flowData,
            nodeId,
            position,
            dims,
            err,
            updater.makeOnEditForBadNode(i)
          );
        }
      } else {
        addSingleNode(flowData, node, position, nodeId, dims, {
          onEditClick: updater.makeOnModalOpenForNode(i, node),
          onXClick: () => updater.removeNode(i),
          onMove: updater.makeOnMoveEvents(i, dims.flipped),
          namer,
          onSetEnabled: () =>
            updater.updateNode(i, {
              ...node,
              enabled: !(node.enabled ?? true),
            }),
        });
      }
    } else {
      addSingleNode(flowData, node, position, nodeId, dims, {
        onEditClick: updater.makeOnModalOpenForNode(i, node),
        onXClick: () => updater.removeNode(i),
        onMove: updater.makeOnMoveEvents(i, dims.flipped),
        namer,
        onSetEnabled: () =>
          updater.updateNode(i, {
            ...node,
            enabled: !(node.enabled ?? true),
          }),
      });
    }
    addEdge(flowData, lastPointId, nodeId, false);
    lastPointId = nodeId;
    lasPos = position;
  }

  // add button
  const addCircle = makeAddButton(
    `${prefix}-+`,
    dims.flipped
      ? {
          y:
            (lasPos === null
              ? dims.padding.y +
                dims.nodeHeight * dims.distanceFactor * (sequence.length + 1)
              : lasPos.y) +
            dims.nodeHeight * dims.distanceFactor,
          x: dims.padding.x + dims.circleSize * 1.5,
        }
      : {
          x:
            (lasPos === null
              ? dims.padding.x +
                dims.nodeWidth * dims.distanceFactor * (sequence.length + 1)
              : lasPos.x) +
            dims.nodeWidth * dims.distanceFactor,
          y: dims.padding.y + dims.circleSize / 4,
        },
    dims,
    updater.addNode,
    false
  );
  flowData.nodes.push(addCircle);
  addEdge(flowData, lastPointId, addCircle.id, false);
  return {
    position: lasPos,
    pointId: lastPointId,
  };
};

const xyApply = (
  p1: XYPosition,
  p2: XYPosition,
  fcn: (a: number, b: number) => number
): XYPosition => ({
  x: fcn(p1.x, p2.x),
  y: fcn(p1.y, p2.y),
});

const addEdge = (
  flowData: FlowData,
  source: string,
  target: string,
  animated: boolean = false
) =>
  flowData.edges.push({
    id: `${source}-${target}`,
    source,
    target,
    animated,
  });

const addSingleNode = (
  flowData: FlowData,
  node: AutomationSequenceNode,
  position: XYPosition,
  nodeId: string,
  dims: DAGAutomationFlowDims,
  opts: {
    onEditClick: () => void;
    onXClick: () => void;
    namer: Namer;
    onMove: DAGNodeOnMoveEvents;
    onSetEnabled: () => void;
  }
) =>
  flowData.nodes.push(
    makeActionPoint(
      nodeId,
      position,
      {
        label: getDescriptionFromAutomationNode(node, opts.namer, true),
        color: getNodeType(node) === "action" ? "green" : "blue",
        hasInput: true,
        enabled: node.enabled ?? true,
        ...opts,
      },
      dims
    )
  );

const addErrorNode = (
  flowData: FlowData,
  nodeId: string,
  position: XYPosition,
  { nodeHeight, nodeWidth }: DAGAutomationFlowDims,
  error: any,
  onEdit: () => void,
  hasInput: boolean = true
) =>
  flowData.nodes.push({
    id: nodeId,
    type: "errornode",
    position,
    data: {
      height: nodeHeight,
      width: nodeWidth,
      hasInput,
      onEdit,
      error,
    },
  });

const addChooseNode = (
  node: ChooseAction,
  position: XYPosition,
  nodeId: string,
  dims: DAGAutomationFlowDims,
  namer: Namer,
  updater: SequenceUpdater,
  i: number
) => {
  const flowData: FlowData = {
    nodes: [],
    edges: [],
  };
  addSingleNode(flowData, node, position, nodeId, dims, {
    onEditClick: updater.makeOnModalOpenForNode(i, node),
    onXClick: () => updater.removeNode(i),
    namer,
    onMove: updater.makeOnMoveEvents(i, dims.flipped),
    onSetEnabled: () =>
      updater.updateNode(i, {
        ...node,
        enabled: !(node.enabled ?? true),
      }),
  });
  let lastPos: XYPosition = position;
  if (!(node.enabled ?? true)) {
    return { lastPos, flowData };
  }
  // conditions
  node.choose.forEach(({ sequence, conditions }, j) => {
    const sequenceId = `${nodeId}.${j}`;
    // edit/delete circle
    const circle = makeFlowCircle(
      `${sequenceId}>delete`,
      dims.flipped
        ? {
            y: position.y + dims.nodeHeight * dims.distanceFactor,
            x:
              lastPos.x +
              Math.max(dims.nodeWidth, dims.conditionWidth) *
                dims.distanceFactor,
          }
        : {
            x: position.x + dims.nodeWidth * dims.distanceFactor,
            y:
              lastPos.y +
              Math.max(dims.nodeHeight, dims.conditionHeight) *
                dims.distanceFactor,
          },
      {
        flipped: dims.flipped,
        size: dims.circleSize,
        onRemove: createOnRemoveForChooseNode(
          node,
          (d) => updater.updateNode(i, d),
          j
        ),
      }
    );
    flowData.nodes.push(circle);
    addEdge(flowData, nodeId, circle.id, true);
    const condNode = makeConditionPoint(
      `${sequenceId}>cond`,
      dims.flipped
        ? {
            y: circle.position.y + dims.circleSize * dims.distanceFactor,
            x: circle.position.x - (dims.conditionWidth - dims.circleSize) / 2,
          }
        : {
            x: circle.position.x + dims.circleSize * dims.distanceFactor,
            y: circle.position.y - (dims.conditionHeight - dims.circleSize) / 2,
          },
      {
        label: getDescriptionFromAutomationNode(
          {
            condition: "and",
            conditions,
          },
          namer,
          true
        ),
        onEditClick: updater.makeOnEditConditionsForChooseNode(i, j),
      },
      dims
    );
    flowData.nodes.push(condNode);
    addEdge(flowData, circle.id, condNode.id, true);

    // actual sub sequence
    const lastPoint = sequenceToFlow(
      flowData,
      sequence,
      condNode.id,
      {
        ...dims,
        padding: dims.flipped
          ? {
              y: condNode.position.y - dims.nodeHeight,
              x:
                condNode.position.x -
                (dims.nodeWidth - dims.conditionWidth) / 2,
            }
          : {
              x: condNode.position.x - dims.nodeWidth,
              y:
                condNode.position.y -
                (dims.nodeHeight - dims.conditionHeight) / 2,
            },
      },
      namer,
      updater.makeChildUpdaterForChooseAction(i, j),
      `${sequenceId}.`
    );
    if (lastPoint.position) {
      lastPos = xyApply(lastPos, lastPoint.position, Math.max);
    } else {
      lastPos = xyApply(
        lastPos,
        dims.flipped
          ? {
              y: lastPos.y,
              x: lastPos.x + dims.nodeWidth * dims.distanceFactor,
            }
          : {
              x: lastPos.x,
              y: lastPos.y + dims.nodeHeight * dims.distanceFactor,
            },
        Math.max
      );
    }
  });
  const totalChildren = node.choose.length;

  // add button
  const addCirlce = makeAddButton(
    `${nodeId}>add`,
    dims.flipped
      ? {
          y: position.y + dims.nodeHeight * dims.distanceFactor,
          x: lastPos.x + dims.nodeWidth * dims.distanceFactor,
        }
      : {
          x: position.x + dims.nodeWidth * dims.distanceFactor,
          y: lastPos.y + dims.nodeHeight * dims.distanceFactor,
        },
    dims,
    () =>
      updater.updateNode(i, {
        ...node,
        choose: [
          ...node.choose,
          {
            sequence: [],
            conditions: [],
          },
        ],
      }),
    false
  );
  flowData.nodes.push(addCirlce);
  addEdge(flowData, nodeId, addCirlce.id, true);

  // else
  const elseCircle = makeFlowCircle(
    `${nodeId}>else`,
    dims.flipped
      ? {
          y: position.y + dims.nodeHeight * dims.distanceFactor,
          x: lastPos.x + dims.nodeWidth * dims.distanceFactor * 2,
        }
      : {
          x: position.x + dims.nodeWidth * dims.distanceFactor,
          y: lastPos.y + dims.nodeHeight * dims.distanceFactor * 2,
        },
    { size: dims.circleSize, flipped: dims.flipped }
  );
  flowData.nodes.push(elseCircle);
  addEdge(flowData, nodeId, elseCircle.id, true);
  const lastPoint = sequenceToFlow(
    flowData,
    node.default ?? [],
    elseCircle.id,
    {
      ...dims,
      padding: dims.flipped
        ? {
            y: position.y,
            x: elseCircle.position.x - 1.4 * dims.circleSize,
          }
        : {
            x: position.x - dims.nodeWidth,
            y: elseCircle.position.y - dims.circleSize / 4,
          },
    },
    namer,
    updater.makeChildUpdaterForChooseAction(i, null),
    `${nodeId}.${totalChildren}.`
  );
  if (lastPoint.position) {
    lastPos = xyApply(lastPos, lastPoint.position, Math.max);
  } else {
    lastPos = xyApply(lastPos, elseCircle.position, Math.max);
  }
  return { lastPos, flowData };
};

export const mergeFlowDatas = (fd1: FlowData, fd2: FlowData): FlowData => {
  fd1.edges = fd1.edges.concat(fd2.edges);
  fd1.nodes = fd1.nodes.concat(fd2.nodes);
  return fd1;
};
