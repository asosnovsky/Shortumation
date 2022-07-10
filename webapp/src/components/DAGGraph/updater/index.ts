import {
  AutomationActionData,
  AutomationNodeTypes,
  AutomationSequenceNode,
} from "types/automations";
import { ModalState } from "../board/types";
import { SequenceNodeActions } from "../nodes/SequenceNode/types";
import { DAGUpdaterArgs } from "./types";
import { mapAutoActionKeyToNodeType } from "./util";

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

      addNode: () =>
        args.openModal({
          allowedTypes: mapAutoActionKeyToNodeType(k),
          saveBtnCreateText: true,
          node: JSON.parse(JSON.stringify(defaultNode)),
          update: (n) => args[k].onUpdate([...args[k].data, n]),
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

export type DAGGraphUpdater = ReturnType<typeof createUpdater>;
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
      let onAddNode: (() => void) | undefined = undefined;
      if (flags.includeAdd) {
        onAddNode = basic[k].addNode;
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
        onAddNode,
        onMove,
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