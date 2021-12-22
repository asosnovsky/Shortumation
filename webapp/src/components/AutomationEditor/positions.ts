import { DAGElement } from "components/DAGSvgs/DAGBoard";
import { Point } from "types/graphs";
import { AutomationTrigger } from 'types/automations/triggers';
import { avgPoints } from "utils/graph";


export function* computeTriggerPos(
  startPoint: Point,
  triggers: AutomationTrigger[],
  toPath: Point,
  onUpdate: (ts: AutomationTrigger[]) => void,
  onEdit: (nt: AutomationTrigger, onSave: (ts: AutomationTrigger) => void) => void,
): Generator<DAGElement> {  
  // functions
  const makeRemoveNode = (i: number) => () => onUpdate([
    ...triggers.slice(0, i),
    ...triggers.slice(i + 1),
  ]);
  const updateNode = (n: AutomationTrigger, i: number) => onUpdate([
    ...triggers.slice(0, i),
    n,
    ...triggers.slice(i + 1),
  ])

  // main loop
  for (let i = 0; i < triggers.length; i++) {
    const node = triggers[i];
    const nodeLoc: Point = [startPoint[0], startPoint[1] + i];
    yield {
      type: "node",
      node,
      loc: nodeLoc,
      onRemove: makeRemoveNode(i),
      onOpen: () => onEdit(node, up => updateNode(up, i))
    }
    yield {
      type: "edge",
      p1: nodeLoc,
      p2: toPath,
      direction: "1->2",
    }
  }
  yield {
    type: 'circle',
    icon: 'add',
    loc: [startPoint[0] + 0.25, startPoint[1] + triggers.length],
    onAdd: () => onUpdate(triggers.concat({
      $smType: 'trigger',
      platform: 'state',
      entity_id: "",
    }))
  }
}

export function* computeExtraField(
  triggerEndPos: Point,
  sequenceStartPos: Point,
): Generator<DAGElement> {
  yield {
    type: 'circle',
    loc: avgPoints(triggerEndPos, sequenceStartPos),
    icon: 'color',
    color: 'blue',
  }
  yield {
    type: 'edge',
    p1: triggerEndPos,
    p2: sequenceStartPos,
    direction: '1->2',
  }
}
