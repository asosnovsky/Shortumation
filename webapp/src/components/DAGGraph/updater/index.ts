import {
  AutomationActionData,
  AutomationSequenceNode,
} from "types/automations";
import { ModalState } from "../board/types";
import { DAGUpdaterArgs } from "./types";

export const createBasicUpdater =
  <K extends keyof AutomationActionData, N extends AutomationActionData[K][0]>(
    k: K,
    defaultNode: AutomationActionData[K][0]
  ) =>
  (args: DAGUpdaterArgs<K>) => {
    return {
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
        args[k].onUpdate([
          ...args[k].data,
          JSON.parse(JSON.stringify(defaultNode)),
        ]),
    };
  };

export type DAGGraphUpdater = ReturnType<typeof createUpdater>;
export const createUpdater = (
  args: DAGUpdaterArgs<"sequence" | "condition" | "trigger">
) => ({
  basic: {
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
  },
});

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
