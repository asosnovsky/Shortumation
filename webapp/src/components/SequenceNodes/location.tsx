import { DAGEdge } from "components/DAGSvgs/DAGEdge";
import { Point } from "types/graphs";
import { DAGNode } from '../DAGSvgs/DAGNode';
import { BaseSequenceNodeSettings, SequenceNodeSettings } from './types';
import { AddButton } from '../DAGSvgs/AddButton';
import { makeUpdater, Updater } from "./updater";
import { ChooseAction } from "types/automations/actions";


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
  const rootUpdater = makeUpdater(sequence, onChange);
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
      onXClick={() => rootUpdater.removeNode(i)}
    />
    if ((node.$smType === 'action') && (node.action === 'choose')) {
      const it = computeChooseNodesEdges(
        node,
        nodeLoc,
        lastStartPoint,
        nextNodeLoc,
        j => rootUpdater.makeChildUpdaterForChooseAction(i, j),
        { ...st, keyPrefix: `${keyPrefix}.${i}` }
      );
      let next = it.next();
      while (!next.done) {
        yield next.value
        next = it.next();
      };
      nextNodeLoc = next.value.nextNodeLoc
      lastStartPoint = next.value.lastStartPoint
    }
    if (i === sequence.length - 1) {
      yield <DAGEdge
        key={`edge${keyPrefix}.${i}`}
        p1={[nodeLoc[0] + st.nodeWidth, nodeLoc[1] + st.nodeHeight / 2]}
        p2={nextNodeLoc}
        direction="1->2"
        color={st.edgeColor}
      />
      yield <AddButton
        key={`add${keyPrefix}.${i}`}
        loc={[nextNodeLoc[0], nextNodeLoc[1] - 4.5]}
        height={10}
        width={10}
        onClick={rootUpdater.addNode}
      />
    }
    lastNodeLoc = [...nodeLoc]
  }
  return lastStartPoint
}

export function* computeChooseNodesEdges(
  node: ChooseAction,
  nodeLoc: Point,
  lastStartPoint: Point,
  nextNodeLoc: Point,
  makeChildUpder: (j: number) => Updater,
  st: BaseSequenceNodeSettings,
) {
  for (let j = 0; j < node.action_data.choose.length; j++) {
    const subStartLoc: Point = [
      nodeLoc[0] + st.nodeWidth * st.distanceFactor,
      nodeLoc[1] + st.nodeHeight * (j + 1)
    ];
    const updater = makeChildUpder(j);
    const it = computeNodesEdges({
      ...st,
      onChange: updater.onChange,
      sequence: node.action_data.choose[j].sequence,
      startPoint: subStartLoc,
      keyPrefix: `.${j}`
    });
    let next = it.next();
    while (!next.done) {
      yield next.value
      next = it.next()
    }
    yield <DAGEdge
      key={`edge${st.keyPrefix}.${j}`}
      p1={[nodeLoc[0] + st.nodeWidth, nodeLoc[1] + st.nodeHeight / 2]}
      p2={[subStartLoc[0], subStartLoc[1] + st.nodeHeight / 2]}
      direction="1->2"
      color={st.edgeColor}
    />
    if (next.value) {
      nextNodeLoc[0] = next.value[0] + st.nodeWidth * st.distanceFactor
      lastStartPoint = [Math.max(next.value[0], lastStartPoint[0]), lastStartPoint[1]]
    } else {
      yield <AddButton
        key={`add${st.keyPrefix}.${j}`}
        loc={[subStartLoc[0], subStartLoc[1] + st.nodeHeight / 2 - 4.5]}
        height={10}
        width={10}
        onClick={updater.addNode}
      />
    }
  }
  return { lastStartPoint, nextNodeLoc }
}
