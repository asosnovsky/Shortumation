import { AutomationSequenceNode } from "types/automations";
import { ChooseAction } from "types/automations/actions";
import { UpdateModalState } from "./types";

export type Updater = ReturnType<typeof makeUpdater>;

export const makeUpdater = (
  sequence: AutomationSequenceNode[],
  onChange: (s: AutomationSequenceNode[]) => void,
  openModal: UpdateModalState,
) => ({
  sequence,
  onChange,
  removeNode(i: number) {
    return onChange([
      ...sequence.slice(0, i),
      ...sequence.slice(i+1),
    ])
  },
  addNode() {
    return openModal({
      single: true,
      saveBtnCreateText: true,
      node: {
        $smType: 'action',
        action: 'choose',
        action_data: {
          choose: [],
          default: [],
        }
      },
      update: n => onChange([
        ...sequence,
        n,
      ]),
      onlyConditions: false,
    })
  },
  updateNode(i: number, node: AutomationSequenceNode) {
    return onChange([
      ...sequence.slice(0, i),
      node,
      ...sequence.slice(i+1),
    ])
  },
  updateChooseActionData(i: number, data: ChooseAction['action_data']) {
    const node = sequence[i] as ChooseAction;
    return this.updateNode(i, {
      ...node,
      action_data: data,
    })
  },
  makeChildUpdaterForChooseAction(i: number, j:number | null) {
    const node = sequence[i];
    if ((node.$smType === 'action') && (node.action === 'choose')) {
      if (j !== null) {
        return makeUpdater(
          node.action_data.choose[j].sequence,
          seq => this.updateNode(i, {
            ...node,
            action_data: {
              ...node.action_data,
              choose: [
                ...node.action_data.choose.slice(0, j),
                {
                  ...node.action_data.choose[j],
                  sequence: seq,
                },
                ...node.action_data.choose.slice(j+1),
              ]
            }
          }),
          openModal,
        )
      } else {
        return makeUpdater(
          node.action_data.default,
          seq => this.updateNode(i, {
            ...node,
            action_data: {
              ...node.action_data,
              default: seq
            }
          }),
          openModal,
        )
      }
    }
    throw new Error(`Cannot create sub-updater for ${node}`)
  }
});
