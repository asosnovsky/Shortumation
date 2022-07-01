import { AutomationSequenceNode } from "types/automations";
import { ChooseAction } from "types/automations/actions";
import { AutomationCondition } from "types/automations/conditions";
import { UpdateModalState } from "./types";
import { getNodeType } from "../../utils/automations";
import { DAGNodeOnMoveEvents } from "./DAGNode";
import { cleanUpUndefined } from "components/NodeEditor/OptionManager/OptionManager";
import { makeOnEditAutomationConditions } from "./helpers";

export type SequenceUpdater = ReturnType<typeof makeSequenceUpdater>;

export const makeSequenceUpdater = (
  sequence: AutomationSequenceNode[],
  onChange: (s: AutomationSequenceNode[]) => void,
  openModal: UpdateModalState
) => ({
  sequence,
  onChange,
  removeNode(i: number) {
    return onChange([...sequence.slice(0, i), ...sequence.slice(i + 1)]);
  },
  addNode() {
    return openModal({
      saveBtnCreateText: true,
      node: {
        device_id: "",
      },
      update: (n) => {
        onChange([...sequence, n]);
      },
      allowedTypes: ["action", "condition"],
    });
  },
  updateNode(i: number, node: AutomationSequenceNode) {
    if (JSON.stringify(node) !== JSON.stringify(sequence[i])) {
      return onChange([
        ...sequence.slice(0, i),
        node,
        ...sequence.slice(i + 1),
      ]);
    }
  },
  updateChooseActionData(i: number, data: ChooseAction) {
    const node = sequence[i] as ChooseAction;
    return this.updateNode(i, {
      ...node,
      ...data,
    });
  },
  makeChildUpdaterForChooseAction(i: number, j: number | null) {
    const node = sequence[i];
    if ("choose" in node) {
      if (j !== null) {
        return makeSequenceUpdater(
          node.choose[j].sequence,
          (seq) =>
            this.updateNode(i, {
              ...node,
              choose: [
                ...node.choose.slice(0, j),
                {
                  ...node.choose[j],
                  sequence: seq,
                },
                ...node.choose.slice(j + 1),
              ],
            }),
          openModal
        );
      } else {
        return makeSequenceUpdater(
          node.default ?? [],
          (seq) =>
            this.updateNode(i, {
              ...node,
              default: seq,
            }),
          openModal
        );
      }
    }
    throw new Error(`Cannot create sub-updater for ${node}`);
  },
  makeOnModalOpenForNode(i: number, node: AutomationSequenceNode) {
    return () =>
      openModal({
        node,
        allowedTypes: ["action", "condition"],
        update: (n) => this.updateNode(i, n),
      });
  },
  makeOnEditConditionsForChooseNode(i: number, j: number) {
    const node = sequence[i] as ChooseAction;
    return makeOnEditAutomationConditions(
      node.choose[j].conditions,
      (conditions) =>
        this.updateNode(i, {
          ...node,
          choose: [
            ...node.choose.slice(0, j),
            {
              sequence: node.choose[j].sequence,
              conditions: conditions as AutomationCondition[],
            },
            ...node.choose.slice(j + 1),
          ],
        }),
      openModal
    );
  },
  makeOnEditForBadNode(i: number) {
    const node = sequence[i];
    return () =>
      openModal({
        isError: true,
        node,
        allowedTypes: [getNodeType(node)],
        update: (n) => this.updateNode(i, n),
      });
  },
  makeOnMoveEvents(i: number, flipped: boolean): DAGNodeOnMoveEvents {
    const moveBack =
      i > 0
        ? () =>
            onChange([
              ...sequence.slice(0, i - 1),
              sequence[i],
              sequence[i - 1],
              ...sequence.slice(i + 1),
            ])
        : undefined;
    const moveForward =
      i < sequence.length - 1
        ? () =>
            onChange([
              ...sequence.slice(0, i),
              sequence[i + 1],
              sequence[i],
              ...sequence.slice(i + 2),
            ])
        : undefined;
    if (flipped) {
      return cleanUpUndefined({
        up: moveBack,
        down: moveForward,
      });
    } else {
      return cleanUpUndefined({
        right: moveForward,
        left: moveBack,
      });
    }
  },
});

export const createOnRemoveForChooseNode =
  (action: ChooseAction, update: (data: ChooseAction) => void, j: number) =>
  () =>
    update({
      ...action,
      choose: [...action.choose.slice(0, j), ...action.choose.slice(j + 1)],
    });
