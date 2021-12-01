import { AutomationSequenceNode } from "types/automations";

export type Updater = ReturnType<typeof makeUpdater>;

export const makeUpdater = (
  sequence: AutomationSequenceNode[],
  onChange: (s: AutomationSequenceNode[]) => void
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
    return onChange([
      ...sequence,
      {
        $smType: 'action',
        action: 'choose',
        action_data: {
          choose: [],
          default: [],
        }
      }
    ])
  },
  updateNode(i: number, node: AutomationSequenceNode) {
    return onChange([
      ...sequence.slice(0, i),
      node,
      ...sequence.slice(i+1),
    ])
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
          })
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
          })
        )
      }
    }
    throw new Error(`Cannot create sub-updater for ${node}`)
  }
});