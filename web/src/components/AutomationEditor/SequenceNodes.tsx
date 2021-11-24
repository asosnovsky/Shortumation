import { FC } from "react";
import { AutomationSequenceNode } from "~/automations/types";
import { getDescriptionFromAutomationNode } from "~/automations/utils";
import DAGEdge from "./DAGEdge";
import DAGNode from "./DAGNode";
import { useNodeStyles } from "./styles";
import { Point } from "./types";


interface Props extends RenderSequenceProps {
  styles: ReturnType<typeof useNodeStyles>,
  sequence: AutomationSequenceNode[],
  triggerPoint: Point,
}
export const SequenceNodes: FC<Props> = ({
  sequence,
  triggerPoint,
  ...renderSequenceProps
}) => {
  const renderSequence = makeRenderSequence(renderSequenceProps);
  return <g id="sequence">
    {sequence.map((n, i) => renderSequence(triggerPoint, n, i))}
  </g>
}

interface RenderSequenceProps {
  styles: ReturnType<typeof useNodeStyles>,
  onUpdate: (i: number, s: AutomationSequenceNode | null) => void,
  nodeWidth: number,
  nodeHeight: number,
  nHDF: number,
}
const makeRenderSequence = ({
  onUpdate,
  nodeHeight,
  nodeWidth,
  nHDF,
  styles: { classes }
}: RenderSequenceProps) => (
  startPoint: Point,
  node: AutomationSequenceNode,
  i: number
) => {
    const nodeLoc: Point = [startPoint[0] + nodeWidth / 2, 0];
    let lastNodeLoc = startPoint;
    if (i > 0) {
      lastNodeLoc = [nodeLoc[0] + nodeWidth * ((i - 1) * nHDF + 1), nodeLoc[1] + nodeHeight / 2];
      nodeLoc[0] += nodeWidth * i * nHDF
    }
    const curretEdgeLoc: Point = [nodeLoc[0], nodeLoc[1] + nodeHeight / 2];
    const nextAddLoc: Point = [nodeLoc[0] + nodeWidth * nHDF, nodeLoc[1] + nodeHeight / 2];
    return <>
      <DAGEdge
        key={`edge.${i}`}
        p1={lastNodeLoc}
        p2={curretEdgeLoc}
        direction="1->2"
        className={classes.dagEdge}
      />
      <DAGNode
        height={nodeHeight}
        width={nodeWidth}
        key={`node.${i}`}
        loc={nodeLoc}
        text={getDescriptionFromAutomationNode(node)}
        color={node.$smType === 'action' ? 'green' : 'blue'}
        onXClick={() => onUpdate(i, null)}
      />
      <DAGEdge
        key={`edge.${i}`}
        p1={curretEdgeLoc}
        p2={nextAddLoc}
        direction="1->2"
        className={classes.dagEdge}
      />
    </>
  }

export function* getJSXNodes(
  { classes }: ReturnType<typeof useNodeStyles>,
  onUpdate: (i: number, s: AutomationSequenceNode | null) => void, it: Generator<NodeEdgeLocation, Point, never>
) {
  let next = it.next();
  while (!next.done) {
    const { node, nodeLoc, curretEdgeLoc, nextAddLoc, lastStartPoint, nodeHeight, nodeWidth } = next.value;
    yield <>
      <DAGEdge
        key={`edge.${i}`}
        p1={nodeLoc}
        p2={curretEdgeLoc}
        direction="1->2"
        className={classes.dagEdge}
      />
      <DAGNode
        height={nodeHeight}
        width={nodeWidth}
        key={`node.${i}`}
        loc={nodeLoc}
        text={getDescriptionFromAutomationNode(node)}
        color={node.$smType === 'action' ? 'green' : 'blue'}
        onXClick={() => onUpdate(i, null)}
      />
      <DAGEdge
        key={`edge.${i}`}
        p1={curretEdgeLoc}
        p2={nextAddLoc}
        direction="1->2"
        className={classes.dagEdge}
      />
    </>
  }
}

type NodeEdgeLocation = {
  nodeId: string;
  node: AutomationSequenceNode;
  nodeLoc: Point;
  lastStartPoint: Point;
  curretEdgeLoc: Point;
  nextAddLoc: Point | null;
  nodeWidth: number;
  nodeHeight: number;
}
export function* computeNodeEdgeLocation(
  startPoint: Point,
  nodeWidth: number,
  nodeHeight: number,
  distanceFactor: number,
  sequence: AutomationSequenceNode[]
): Generator<NodeEdgeLocation, Point, never> {
  let lastStartPoint: Point = [...startPoint];
  for (let i = 0; i < sequence.length; i++) {
    const node = sequence[i];
    const nodeLoc: Point = lastStartPoint = [lastStartPoint[0], lastStartPoint[1] + nodeWidth * distanceFactor];
    const curretEdgeLoc: Point = [nodeLoc[0], nodeLoc[1] + nodeHeight / 2];
    const nextAddLoc: Point | null = i < sequence.length ? null : [nodeLoc[0] + nodeWidth * distanceFactor, nodeLoc[1] + nodeHeight / 2];
    // if ((node.$smType === 'action') && (node.action === 'choose')) {
    //   for (let { sequence } of node.action_data.choose) {
    //     for (let parsedChild of computeNodeEdgeLocation(
    //       nodeLoc,
    //       nodeWidth,
    //       nodeHeight,
    //       distanceFactor,
    //       sequence
    //     )) {
    //       yield parsedChild;
    //     }
    //   }
    // }
    yield { node, nodeLoc, lastStartPoint, curretEdgeLoc, nextAddLoc, nodeHeight, nodeWidth }
  }
  return lastStartPoint
}
