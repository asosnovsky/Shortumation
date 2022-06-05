import { AutomationSequenceNode } from "types/automations";
import { ChooseAction } from "types/automations/actions";
import { AutomationCondition } from "types/automations/conditions";
import { UpdateModalState } from "./types";
import { getNodeType } from '../../utils/automations';

export type SequenceUpdater = ReturnType<typeof makeSequenceUpdater>;

export const makeSequenceUpdater = (
  sequence: AutomationSequenceNode[],
  onChange: (s: AutomationSequenceNode[]) => void,
  openModal: UpdateModalState,
) => ({
  sequence,
  onChange,
  removeNode(i: number) {
    return onChange([
      ...sequence.slice(0, i),
      ...sequence.slice(i + 1),
    ])
  },
  addNode() {
    return openModal({
      single: true,
      saveBtnCreateText: true,
      node: {
        choose: [],
        default: [],
      },
      update: n => {
        onChange([
          ...sequence,
          n,
        ])
      },
      allowedTypes: ['action', 'condition']
    })
  },
  updateNode(i: number, node: AutomationSequenceNode) {
    if (JSON.stringify(node) !== JSON.stringify(sequence[i])) {
      return onChange([
        ...sequence.slice(0, i),
        node,
        ...sequence.slice(i + 1),
      ])
    }
  },
  updateChooseActionData(i: number, data: ChooseAction) {
    const node = sequence[i] as ChooseAction;
    return this.updateNode(i, {
      ...node,
      ...data,
    })
  },
  makeChildUpdaterForChooseAction(i: number, j: number | null) {
    const node = sequence[i];
    if ('choose' in node) {
      if (j !== null) {
        return makeSequenceUpdater(
          node.choose[j].sequence,
          seq => this.updateNode(i, {
            ...node,
            choose: [
              ...node.choose.slice(0, j),
              {
                ...node.choose[j],
                sequence: seq,
              },
              ...node.choose.slice(j + 1),
            ]
          }),
          openModal,
        )
      } else {
        return makeSequenceUpdater(
          node.default ?? [],
          seq => this.updateNode(i, {
            ...node,
            default: seq
          }),
          openModal,
        )
      }
    }
    throw new Error(`Cannot create sub-updater for ${node}`)
  },
  makeOnModalOpenForNode(
    i: number,
    node: AutomationSequenceNode,
  ) {
    return () => openModal({
      single: true,
      node,
      allowedTypes: ['action', 'condition'],
      update: n => this.updateNode(i, n),
    })
  },
  makeOnEditConditionsForChooseNode(
    i: number,
    j: number,
  ) {
    return () => {
      const node = sequence[i] as ChooseAction;
      return openModal({
        single: false,
        node: node.choose[j].conditions,
        allowedTypes: ['condition'],
        update: conditions => this.updateNode(i, {
          ...node,
          choose: [
            ...node.choose.slice(0, j),
            {
              sequence: node.choose[j].sequence,
              conditions: conditions as AutomationCondition[],
            },
            ...node.choose.slice(j + 1),
          ]
        }),
      })
    }
  },
  makeOnEditForBadNode(i: number) {
    const node = sequence[i];
    return () => openModal({
      single: true,
      isError: true,
      node,
      allowedTypes: [getNodeType(node)],
      update: n => this.updateNode(i, n),
    })
  }
});


export const createOnRemoveForChooseNode = (
  action: ChooseAction,
  update: (data: ChooseAction) => void,
  j: number
) => () => update({
  ...action,
  choose: [
    ...action.choose.slice(0, j),
    ...action.choose.slice(j + 1),
  ]
})
