import {
  AutomationActionData,
  AutomationSequenceNode,
} from "types/automations";
import { ModalState } from "../board/types";
import { SequenceNodeActions } from "../nodes/SequenceNode/types";
import { DAGUpdaterArgs, DAGUpdaterInput } from "./types";
import {
  convertChooseActionToOrignal,
  mapAutoActionKeyToNodeType,
} from "./util";
import {
  ChooseAction,
  RepeatAction,
  ParallelAction,
} from "types/automations/actions";
import { convertScriptConditionFieldToAutomationConditions } from "utils/automations";
import { AutomationNode } from "types/automations";

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

export type DAGGraphUpdater = ReturnType<typeof createUpdater>;
export type DAGGraphChooseUpdater = ReturnType<
  DAGGraphUpdater["createChoosNodeUpdater"]
>;
export const createUpdater = (
  args: DAGUpdaterArgs<"action" | "condition" | "trigger">
) => {
  const basic = {
    action: createBasicUpdater("action", {
      device_id: "",
    })({
      action: args.action,
      openModal: args.openModal,
    }),
    trigger: createBasicUpdater("trigger", {
      platform: "device",
      domain: "",
      type: "",
      device_id: "",
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
      const node = convertChooseActionToOrignal(
        args.action.data[i] as ChooseAction
      );
      if (j === "else") {
        return {
          stateUpdater: createUpdater({
            openModal: args.openModal,
            condition: {
              data: [],
              onUpdate: console.warn,
            },
            action: {
              data: node.default ?? [],
              onUpdate: (upd) =>
                basic.action.updateNode(
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
            basic.action.updateNode(
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
                basic.action.updateNode(
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
            action: {
              data: node.choose[j].sequence,
              onUpdate: (upd) =>
                basic.action.updateNode(
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
      const { repeat, ...rest } = args.action.data[i] as RepeatAction;
      const action = {
        data: repeat.sequence,
        onUpdate: (upd: AutomationNode[]) =>
          basic.action.updateNode(
            {
              ...rest,
              repeat: {
                ...repeat,
                sequence: upd,
              },
            },
            i
          ),
      };

      if ("while" in repeat) {
        return createUpdater({
          openModal: args.openModal,
          condition: {
            data: convertScriptConditionFieldToAutomationConditions(
              repeat.while
            ),
            onUpdate: (upd: any) =>
              basic.action.updateNode(
                {
                  ...rest,
                  repeat: {
                    ...repeat,
                    while: upd,
                  },
                },
                i
              ),
          },
          trigger: createDummyUpdater(),
          action,
        });
      }

      if ("until" in repeat) {
        return createUpdater({
          openModal: args.openModal,
          condition: {
            data: convertScriptConditionFieldToAutomationConditions(
              repeat.until
            ),
            onUpdate: (upd: any) =>
              basic.action.updateNode(
                {
                  ...rest,
                  repeat: {
                    ...repeat,
                    until: upd,
                  },
                },
                i
              ),
          },
          trigger: createDummyUpdater(),
          action,
        });
      }

      return createUpdater({
        openModal: args.openModal,
        condition: createDummyUpdater(),
        trigger: createDummyUpdater(),
        action,
      });
    },
    createParallelNodeUpdater(i: number, j: number) {
      const { parallel, ...rest } = args.action.data[i] as ParallelAction;
      const child = parallel[j];

      return {
        onRemove: () =>
          basic.action.updateNode(
            {
              ...rest,
              parallel: [...parallel.slice(0, j), ...parallel.slice(j + 1)],
            },
            i
          ),
        stateUpdater: createUpdater({
          openModal: args.openModal,
          condition: createDummyUpdater(),
          trigger: createDummyUpdater(),
          action: {
            data: "sequence" in child ? child.sequence : [child],
            onUpdate(d) {
              basic.action.updateNode(
                {
                  ...rest,
                  parallel: [
                    ...parallel.slice(0, j),
                    { sequence: d },
                    ...parallel.slice(j + 1),
                  ],
                },
                i
              );
            },
          },
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
    action: {
      data: auto.action,
      onUpdate: (s: AutomationSequenceNode[]) =>
        onUpdate({
          ...auto,
          action: s,
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
