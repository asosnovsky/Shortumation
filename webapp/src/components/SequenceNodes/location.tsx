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
  keyPrefix: string = "",
): Generator<JSX.Element, [Point, Point | null], never> {
  let lastStartPoint: Point | null = null;
  let lastNodeLoc: Point | null = null;
  for (let i = 0; i < sequence.length; i++) {
    const node = sequence[i];
    const nodeLoc: Point = lastStartPoint = lastStartPoint === null ? [...startPoint] : [
      lastStartPoint[0] + nodeWidth * distanceFactor,
      lastStartPoint[1]
    ];
    let nextNodeLoc: Point = [nodeLoc[0] + distanceFactor * nodeWidth, nodeLoc[1] + nodeHeight / 2];
    yield <DAGNode
      key={`node${keyPrefix}.${i}`}
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
    if ((node.$smType === 'action') && (node.action === 'choose')) {
      for (let j = 0; j < node.action_data.choose.length; j++) {
        const subSeq = node.action_data.choose[j].sequence;
        const subStartLoc: Point = [
          nodeLoc[0] + nodeWidth * distanceFactor,
          nodeLoc[1] + nodeHeight * (j + 1)
        ];
        const it = computeNodesEdges(
          subStartLoc,
          nodeWidth,
          nodeHeight,
          distanceFactor,
          subSeq,
          edgeColor,
          keyPrefix=`.${i}.${j}[${nodeLoc}]`
        );
        yield <DAGEdge
          p1={[nodeLoc[0] + nodeWidth, nodeLoc[1] + nodeHeight / 2]}
          p2={[subStartLoc[0], subStartLoc[1] + nodeHeight / 2]}
          direction="1->2"
          color={edgeColor}
        />
        let next = it.next();
        while (!next.done) {
          yield next.value
          next = it.next()
        }
        nextNodeLoc[0] = (next.value as any)[1][0] + nodeWidth * distanceFactor
        lastStartPoint = [(next.value as any)[1][0], lastStartPoint[1]]
      }
    }
    if (i === sequence.length - 1) {
      yield <DAGEdge
        p1={[nodeLoc[0] + nodeWidth, nodeLoc[1] + nodeHeight / 2]}
        p2={nextNodeLoc}
        direction="1->2"
        color={edgeColor}
      />
    }
    lastNodeLoc = [...nodeLoc]
  }
  return [startPoint, lastStartPoint]
}
