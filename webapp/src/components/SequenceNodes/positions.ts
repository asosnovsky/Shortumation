import { DAGElement } from "components/DAGSvgs/DAGBoard";
import { AutomationSequenceNode } from "types/automations";
import { Point } from "types/graphs";
import { makeUpdater, Updater } from './updater';

const offsetPoint = (
  [x, y]: Point,
  [ox, oy]: Point = [0, 0]
): Point => [x + ox, y + oy];
;

function* inner(
  nodeLoc: Point,
  innerStartLoc: Point,
  updater: Updater,
  keyPrefix: string,
  sequence: AutomationSequenceNode[],
): Generator<DAGElement>  {
  yield {
    type: 'edge',
    p1: nodeLoc,
    p2: innerStartLoc,
    direction: '1->2',
    key: `${keyPrefix}-${nodeLoc}:${innerStartLoc}`,
    onAdd: sequence.length === 0 ? updater.addNode : undefined,
  }
  for (let childNode of computeNodesEdgesPos(
    innerStartLoc,
    sequence,
    updater.onChange,
    keyPrefix,
  )) {
    yield childNode
  }
}

const makeOffsetMaintainer = (startPoint: Point) => {
  let offset: Point = [0, 0];
  let i = 0;
  return {
    setI(newI: number) {
      i = newI;
    },
    resetY() {
      offset[1] = 0;
    },
    update(p: Point, innerStartLoc: Point) {
      offset[0] = Math.max(offset[0], p[0] - i - 0.5 - startPoint[0])
      offset[1] = Math.max(offset[1], p[1] - innerStartLoc[1] + 1)
    },
    get x() {
      return offset[0]
    },
    get y() {
      return offset[1]
    }
  }
}
export function* computeNodesEdgesPos(
  startPoint: Point,
  sequence: AutomationSequenceNode[],
  onChange: (s: AutomationSequenceNode[]) => void,
  keyPrefix: string = '$',
): Generator<DAGElement> {
  const rootUpdater = makeUpdater(sequence, onChange);
  const offset = makeOffsetMaintainer(startPoint)

  for (let i = 0; i < sequence.length; i++) {
    offset.setI(i)
    const node = sequence[i];
    const nodeLoc = offsetPoint(startPoint, [i + offset.x, 0]);
    yield {
      type: 'node',
      key: `${keyPrefix}${i}`,
      loc: nodeLoc,
      node,
      onRemove: () => rootUpdater.removeNode(i),
      onAdd: i === sequence.length - 1 ? rootUpdater.addNode : undefined,
    }
    if (i > 0) {
      yield {
        type: 'edge',
        key: `${keyPrefix}(${i-1}->${i})`,
        p1: offsetPoint(startPoint, [i - 1, 0]),
        p2: offsetPoint(nodeLoc, [0, 0]),
        direction: '1->2',
      }
    }
    if (
      (node.$smType === 'action') && (node.action === 'choose')
    ) {
      offset.resetY()
      
      for (let j = 0; j < node.action_data.choose.length; j++) {
        const innerStartLoc = offsetPoint(nodeLoc, [1, j + 1 + offset.y]);
        for (let elm of inner(
          nodeLoc,
          innerStartLoc ,
          rootUpdater.makeChildUpdaterForChooseAction(i, j),
          `${keyPrefix}.${i}.${j}`,
          node.action_data.choose[j].sequence
        )) {
          yield elm
          if (elm.type === 'node') {
            offset.update(elm.loc, innerStartLoc)
          }
        }
      }
      const innerStartLoc = offsetPoint(nodeLoc, [1, node.action_data.choose.length + 1 + offset.y]);
      for (let elm of inner(
        nodeLoc,
        innerStartLoc,
        rootUpdater.makeChildUpdaterForChooseAction(i, null),
        `${keyPrefix}${i}-d`,
        node.action_data.default,
      )) {
        yield elm
        if (elm.type === 'node') {
          offset.update(elm.loc, innerStartLoc)
        }
      }
    }
  }
}
