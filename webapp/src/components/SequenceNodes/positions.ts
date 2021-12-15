import { DAGElement } from "components/DAGSvgs/DAGBoard";
import { AutomationSequenceNode } from "types/automations";
import { Point } from "types/graphs";
import { makeUpdater, Updater } from './updater';
import { ChooseAction } from 'types/automations/actions';
import { AutomationCondition } from "types/automations/conditions";

export type UpdateNode = (
  node: AutomationSequenceNode,
  updateNode: (n: AutomationSequenceNode) => void,
  onlyConditions: boolean,
) => void;

const offsetPoint = (
  [x, y]: Point,
  [ox, oy]: Point = [0, 0],
): Point => [x + ox, y + oy];

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

function* dealWithNested(
  nodeLoc: Point,
  innerStartLoc: Point,
  updater: Updater,
  sequence: AutomationSequenceNode[],
  openModal: UpdateNode,
  onEdit: () => void,
): Generator<DAGElement>  {
  const np = offsetPoint(innerStartLoc, [0.5, 0]);
  yield {
    type: 'edge',
    p1: nodeLoc,
    p2: innerStartLoc,
    direction: '1->2',
  }
  yield {
    type: 'circle',
    loc: innerStartLoc,
    onClick: ['edit', onEdit],
  }
  yield {
    type: 'edge',
    p1: innerStartLoc,
    p2: np,
    direction: '1->2',
    onAdd: sequence.length === 0 ? updater.addNode : undefined,
    fromCircle: true,
  }
  for (let childNode of computeNodesEdgesPos(
    np,
    sequence,
    updater.onChange,
    openModal,
  )) {
    yield childNode
  }
}

function* dealWithChoose(
  node: ChooseAction,
  nodeLoc: Point,
  makeUpdater: (j: number | null) => Updater,
  updateData: (data: ChooseAction['action_data']) => void,
  openModal: UpdateNode,
  offset: ReturnType<typeof makeOffsetMaintainer>,
): Generator<DAGElement> {
  offset.resetY()
  // conditions
  for (let j = 0; j < node.action_data.choose.length; j++) {
    const innerStartLoc = offsetPoint(nodeLoc, [1, j + 1 + offset.y]);
    const updater = makeUpdater(j);
    for (let elm of dealWithNested(
      nodeLoc,
      innerStartLoc ,
      updater,
      node.action_data.choose[j].sequence,
      openModal,
      () => openModal(
        node.action_data.choose[j].conditions[0] ?? {
          '$smType': 'condition', 'condition': 'and', 'condition_data': {
          'conditions': []
        }},
        (n) => updateData({
          ...node.action_data,
          choose: [
            ...node.action_data.choose.slice(0, j),
            {
              sequence: node.action_data.choose[j].sequence,
              conditions: [n] as AutomationCondition[],
            },
            ...node.action_data.choose.slice(j+1),
          ]
        }),
        true,
      ),
    )) {
      yield elm
      if (elm.type === 'node') {
        offset.update(elm.loc, innerStartLoc)
      }
      if (elm.type === 'circle') {
        offset.update(offsetPoint(elm.loc, [0, -1]), innerStartLoc)
      }
    }
  }
  // default
  const innerStartLoc = offsetPoint(
    nodeLoc,
    [1, node.action_data.choose.length + 2 + offset.y],
  );
  for (let elm of dealWithNested(
    nodeLoc,
    innerStartLoc,
    makeUpdater(null),
    node.action_data.default,
    openModal,
    () => {}
  )) {
    yield elm
    if (elm.type === 'node') {
      offset.update(elm.loc, innerStartLoc)
    }
  }
  // add new conditions
  const newCondLoc = offsetPoint(
    nodeLoc,
    [1, node.action_data.choose.length + 1 + offset.y],
  );
  yield {
    type: 'circle',
    loc: newCondLoc,
    onClick: ['add', () => updateData({
      ...node.action_data,
      choose: [
        ...node.action_data.choose,
        {
          conditions: [],
          sequence: [],
        }
      ]
    })],
  }
}


export function* computeNodesEdgesPos(
  startPoint: Point,
  sequence: AutomationSequenceNode[],
  onChange: (s: AutomationSequenceNode[]) => void,
  openModal: UpdateNode,
): Generator<DAGElement> {
  const rootUpdater = makeUpdater(sequence, onChange);
  const offset = makeOffsetMaintainer(startPoint)
  let lastNodeLoc: Point | null = null;
  for (let i = 0; i < sequence.length; i++) {
    offset.setI(i)
    const node = sequence[i];
    const nodeLoc = offsetPoint(startPoint, [i + offset.x, 0]);
    yield {
      type: 'node',
      loc: nodeLoc,
      node,
      onOpen: () => openModal(node, n => rootUpdater.updateNode(i, n), false),
      onRemove: () => rootUpdater.removeNode(i),
      onAdd: i === sequence.length - 1 ? rootUpdater.addNode : undefined,
    }
    if (lastNodeLoc) {
      yield {
        type: 'edge',
        p1: lastNodeLoc,
        p2: nodeLoc,
        direction: '1->2',
      }
    }
    lastNodeLoc = [...nodeLoc];
    if (
      (node.$smType === 'action') && (node.action === 'choose')
    ) {
      yield* dealWithChoose(
        node,
        nodeLoc,
        j => rootUpdater.makeChildUpdaterForChooseAction(i, j),
        actionData => rootUpdater.updateChooseActionData(i, actionData),
        openModal,
        offset,
      )
    }
  }
}
