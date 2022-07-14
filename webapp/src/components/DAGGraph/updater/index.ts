import {
  AutomationActionData,
  AutomationSequenceNode,
} from "types/automations";
import { ModalState } from "../board/types";
import { SequenceNodeActions } from "../nodes/SequenceNode/types";
import { DAGUpdaterArgs, DAGUpdaterInput } from "./types";
import { mapAutoActionKeyToNodeType } from "./util";
import { ChooseAction, RepeatAction } from "types/automations/actions";
import { ScriptConditionField } from "types/automations/common";
import { convertScriptConditionFieldToAutomationConditions } from "utils/automations";

export const createBasicUpdater =
  <K extends keyof AutomationActionData, N extends AutomationActionData[K][0]>(
    k: K,
    defaultNode: AutomationActionData[K][0]
  ) =>
  (args: DAGUpdaterArgs<K>) => {
    return {
      get defaultNode() {
        return JSON.parse(JSON.stringify(defaultNode));
      },
      setEnabled: (i: number) =>
        args[k].onUpdate([
          ...args[k].data.slice(0, i),
          { ...args[k].data[i], enabled: !(args[k].data[i].enabled ?? true) },
          ...args[k].data.slice(i + 1),
        ]),
      updateNode: (n: N, i: number) =>
        args[k].onUpdate([
          ...args[k].data.slice(0, i),
          n,
          ...args[k].data.slice(i + 1),
        ]),
      deleteNode: (i: number) =>
        args[k].onUpdate([
          ...args[k].data.slice(0, i),
          ...args[k].data.slice(i + 1),
        ]),

      addNode: (afterIndex: number | null) =>
        args.openModal({
          allowedTypes: mapAutoActionKeyToNodeType(k),
          saveBtnCreateText: true,
          node: JSON.parse(JSON.stringify(defaultNode)),
          update: (n) => {
            if (afterIndex !== null) {
              args[k].onUpdate([
                ...args[k].data.slice(0, afterIndex),
                n,
                ...args[k].data.slice(afterIndex),
              ]);
            } else {
              args[k].onUpdate([...args[k].data, n]);
            }
          },
        }),
      onMove: (i: number, direction: "back" | "forward") => {
        if (direction === "back" && i > 0) {
          return args[k].onUpdate([
            ...args[k].data.slice(0, i - 1),
            args[k].data[i],
            args[k].data[i - 1],
            ...args[k].data.slice(i + 1),
          ]);
        } else if (direction === "forward" && i < args[k].data.length - 1) {
          return args[k].onUpdate([
            ...args[k].data.slice(0, i),
            args[k].data[i + 1],
            args[k].data[i],
            ...args[k].data.slice(i + 2),
          ]);
        }
      },
    };
  };

export const createDummyUpdater = (): DAGUpdaterInput<any> => ({
  data: [],
  onUpdate: console.warn,
});
// export const createScriptConditionFieldUpdater = (f: ScriptConditionField, )

export type DAGGraphUpdater = ReturnType<typeof createUpdater>;
export type DAGGraphChooseUpdater = ReturnType<
  DAGGraphUpdater["createChoosNodeUpdater"]
>;
export const createUpdater = (
  args: DAGUpdaterArgs<"sequence" | "condition" | "trigger">
) => {
  const basic = {
    sequence: createBasicUpdater("sequence", {
      device_id: "",
    })({
      sequence: args.sequence,
      openModal: args.openModal,
    }),
    trigger: createBasicUpdater("trigger", {
      platform: "device",
    })({
      trigger: args.trigger,
      openModal: args.openModal,
    } as any),
    condition: createBasicUpdater("condition", {
      condition: "device",
      device_id: "",
      domain: "",
      type: "",
    })({
      condition: args.condition,
      openModal: args.openModal,
    } as any),
  };

  return {
    basic,
    createNodeActions<K extends keyof AutomationActionData>(
      k: K,
      i: number,
      flags: Partial<{
        includeAdd: boolean;
        flipped: boolean;
      }>
    ): Partial<SequenceNodeActions> {
      // alias
      const allowedTypes = mapAutoActionKeyToNodeType(k);
      // build move
      const onMove: SequenceNodeActions["onMove"] = {};
      if (!flags.flipped) {
        if (i > 0) {
          onMove["left"] = () => basic[k].onMove(i, "back");
        }
        if (i < args[k].data.length - 1) {
          onMove["right"] = () => basic[k].onMove(i, "forward");
        }
      } else {
        if (i > 0) {
          onMove["up"] = () => basic[k].onMove(i, "back");
        }
        if (i < args[k].data.length - 1) {
          onMove["down"] = () => basic[k].onMove(i, "forward");
        }
      }
      // build add
      let onAdd: SequenceNodeActions["onAdd"] = {};
      if (flags.includeAdd) {
        if (!flags.flipped) {
          onAdd["left"] = () => basic[k].addNode(i);
          onAdd["right"] = () => basic[k].addNode(i + 1);
        } else {
          onAdd["up"] = () => basic[k].addNode(i);
          onAdd["down"] = () => basic[k].addNode(i + 1);
        }
      }

      return {
        onEditClick: () =>
          args.openModal({
            allowedTypes,
            node: args[k].data[i],
            saveBtnCreateText: false,
            update: (n) => basic[k].updateNode(n, i),
          }),
        onXClick: () => basic[k].deleteNode(i),
        onSetEnabled: () => basic[k].setEnabled(i),
        onAdd,
        onMove,
      };
    },
    createChoosNodeUpdater(i: number, j: number | "else") {
      const node = args.sequence.data[i] as ChooseAction;
      if (j === "else") {
        return {
          stateUpdater: createUpdater({
            openModal: args.openModal,
            condition: {
              data: [],
              onUpdate: console.warn,
            },
            sequence: {
              data: node.default ?? [],
              onUpdate: (upd) =>
                basic.sequence.updateNode(
                  {
                    ...node,
                    default: upd,
                  },
                  i
                ),
            },
            trigger: {
              data: [],
              onUpdate: console.warn,
            },
          }),
          onRemove: () => {},
        };
      } else {
        return {
          onRemove: () =>
            basic.sequence.updateNode(
              {
                ...node,
                choose: [
                  ...node.choose.slice(0, j),
                  ...node.choose.slice(j + 1),
                ],
              },
              i
            ),
          stateUpdater: createUpdater({
            openModal: args.openModal,
            condition: {
              data: node.choose[j].conditions,
              onUpdate: (upd: any) =>
                basic.sequence.updateNode(
                  {
                    ...node,
                    choose: [
                      ...node.choose.slice(0, j),
                      {
                        ...node.choose[j],
                        conditions: upd,
                      },
                      ...node.choose.slice(j + 1),
                    ],
                  },
                  i
                ),
            },
            sequence: {
              data: node.choose[j].sequence,
              onUpdate: (upd) =>
                basic.sequence.updateNode(
                  {
                    ...node,
                    choose: [
                      ...node.choose.slice(0, j),
                      {
                        ...node.choose[j],
                        sequence: upd,
                      },
                      ...node.choose.slice(j + 1),
                    ],
                  },
                  i
                ),
            },
            trigger: {
              data: [],
              onUpdate: console.warn,
            },
          }),
        };
      }
    },
    createRepeatNodeUpdater(i: number) {
      const { repeat } = args.sequence.data[i] as RepeatAction;

      return {
        sequence: createUpdater({
          openModal: args.openModal,
          condition: createDummyUpdater(),
          sequence: {
            data: repeat.sequence,
            onUpdate: (upd) =>
              basic.sequence.updateNode(
                {
                  repeat: {
                    ...repeat,
                    sequence: upd,
                  },
                },
                i
              ),
          },
          trigger: createDummyUpdater(),
        }),
        while: createUpdater({
          openModal: args.openModal,
          condition: {
            data: convertScriptConditionFieldToAutomationConditions(
              repeat.while
            ),
            onUpdate: (upd: any) =>
              basic.sequence.updateNode(
                {
                  repeat: {
                    ...repeat,
                    while: upd,
                  },
                },
                i
              ),
          },
          sequence: createDummyUpdater(),
          trigger: createDummyUpdater(),
        }),
        until: createUpdater({
          openModal: args.openModal,
          condition: {
            data: convertScriptConditionFieldToAutomationConditions(
              repeat.until
            ),
            onUpdate: (upd: any) =>
              basic.sequence.updateNode(
                {
                  repeat: {
                    ...repeat,
                    until: upd,
                  },
                },
                i
              ),
          },
          sequence: createDummyUpdater(),
          trigger: createDummyUpdater(),
        }),
      };
    },
  };
};

export const createUpdaterFromAutomationData = (
  openModal: (m: ModalState) => void,
  auto: AutomationActionData,
  onUpdate: (a: AutomationActionData) => void
): DAGGraphUpdater =>
  createUpdater({
    sequence: {
      data: auto.sequence,
      onUpdate: (s: AutomationSequenceNode[]) =>
        onUpdate({
          ...auto,
          sequence: s,
        }),
    },
    condition: {
      data: auto.condition,
      onUpdate: (s: any) =>
        onUpdate({
          ...auto,
          condition: s,
        }),
    },
    trigger: {
      data: auto.trigger,
      onUpdate: (s: any) =>
        onUpdate({
          ...auto,
          trigger: s,
        }),
    },
    openModal,
  });
