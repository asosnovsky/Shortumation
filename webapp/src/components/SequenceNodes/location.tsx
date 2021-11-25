import { DAGEdge } from "components/DAGSvgs/DAGEdge";
import { AutomationSequenceNode } from "types/automations";
import { Point } from "types/graphs";
import { DAGNode } from '../DAGSvgs/DAGNode';
import { SequenceNodeSettings } from './types';


export function* computeNodesEdges(
  {
    sequence,
    keyPrefix = "",
    onChange = () => { },
    ...st
  }: SequenceNodeSettings,
): Generator<JSX.Element, Point | null, never> {
  let lastStartPoint: Point | null = null;
  let lastNodeLoc: Point | null = null;
  for (let i = 0; i < sequence.length; i++) {
    const node = sequence[i];
    const nodeLoc: Point = lastStartPoint = lastStartPoint === null ? [...st.startPoint] : [
      lastStartPoint[0] + st.nodeWidth * st.distanceFactor,
      lastStartPoint[1]
    ];
    let nextNodeLoc: Point = [nodeLoc[0] + st.distanceFactor * st.nodeWidth, nodeLoc[1] + st.nodeHeight / 2];
    yield <DAGNode
      key={`node${keyPrefix}.${i}`}
      height={st.nodeHeight}
      width={st.nodeWidth}
      loc={nodeLoc}
      text={node.$smType}
      color={node.$smType === 'action' ? 'green' : 'blue'}
      edge={lastNodeLoc === null ? undefined : {
        direction: '1<-2',
        loc: [lastNodeLoc[0] + st.nodeWidth, lastNodeLoc[1] + st.nodeHeight / 2],
        color: st.edgeColor,
      }}
      onXClick={() => onChange([
        ...sequence.slice(0, i),
        ...sequence.slice(i + 1),
      ])}
    />
    if ((node.$smType === 'action') && (node.action === 'choose')) {
      for (let j = 0; j < node.action_data.choose.length; j++) {
        const subStartLoc: Point = [
          nodeLoc[0] + st.nodeWidth * st.distanceFactor,
          nodeLoc[1] + st.nodeHeight * (j + 1)
        ];
        const it = computeNodesEdges({
          ...st,
          onChange: seq => onChange([
            ...sequence.slice(0, i),
            {
              ...node,
              action_data: {
                ...node.action_data,
                choose: [
                  ...node.action_data.choose.slice(0, j),
                  {
                    ...node.action_data.choose[j],
                    sequence: seq,
                  },
                  ...node.action_data.choose.slice(j + 1),
                ]
              }
            },
            ...sequence.slice(i + 1),
          ]),
          sequence: node.action_data.choose[j].sequence,
          startPoint: subStartLoc,
          keyPrefix: `.${i}.${j}`
        });
        let next = it.next();
        while (!next.done) {
          yield next.value
          next = it.next()
        }
        if (next.value) {
          yield <DAGEdge
            key={`edge${keyPrefix}.${i}.${j}`}
            p1={[nodeLoc[0] + st.nodeWidth, nodeLoc[1] + st.nodeHeight / 2]}
            p2={[subStartLoc[0], subStartLoc[1] + st.nodeHeight / 2]}
            direction="1->2"
            color={st.edgeColor}
          />
          nextNodeLoc[0] = next.value[0] + st.nodeWidth * st.distanceFactor
          lastStartPoint = [next.value[0], lastStartPoint[1]]
        }
      }
    }
    if (i === sequence.length - 1) {
      yield <DAGEdge
        key={`edge${keyPrefix}.${i}`}
        p1={[nodeLoc[0] + st.nodeWidth, nodeLoc[1] + st.nodeHeight / 2]}
        p2={nextNodeLoc}
        direction="1->2"
        color={st.edgeColor}
      />
    }
    lastNodeLoc = [...nodeLoc]
  }
  return lastStartPoint
}
