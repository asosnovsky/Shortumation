import { DAGEdge } from "components/DAGSvgs/DAGEdge";
import { AutomationSequenceNode } from "types/automations";
import { Point } from "types/graphs";
import { DAGNode } from '../DAGSvgs/DAGNode';


export function* computeNodesEdges(
  startPoint: Point,
  nodeWidth: number,
  nodeHeight: number,
  distanceFactor: number,
  sequence: AutomationSequenceNode[],
  edgeColor: string,
): Generator<JSX.Element, [Point, Point], never> {
  let lastStartPoint: Point = [...startPoint];
  let lastNodeLoc: Point | null = null;
  for (let i = 0; i < sequence.length; i++) {
    const node = sequence[i];
    const nodeLoc: Point = lastStartPoint = [lastStartPoint[0]  + nodeWidth * distanceFactor, lastStartPoint[1]];
    // const curretEdgeLoc: Point = [nodeLoc[0], nodeLoc[1] + nodeHeight / 2];
    // const nextAddLoc: Point | null = i < sequence.length ? null : [nodeLoc[0] + nodeWidth * distanceFactor, nodeLoc[1] + nodeHeight / 2];
    yield <>
      <DAGNode
        key={`node.${i}`}
        height={nodeHeight}
        width={nodeWidth}
        loc={nodeLoc}
        text={node.$smType}
        color={node.$smType === 'action' ? 'green' : 'blue'}
        edge={lastNodeLoc === null ? undefined : {
          direction: '1<-2',
          loc: [lastNodeLoc[0] + nodeWidth, lastNodeLoc[1] + nodeHeight / 2],
          color: edgeColor,
        }}
      />
    </>
    lastNodeLoc = [...nodeLoc]
  }
  return [startPoint, lastStartPoint]
}
