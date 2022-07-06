import { AutomationSequenceNode } from "types/automations";
import { AutomationCondition } from "types/automations/conditions";
import { AutomationTrigger } from "types/automations/triggers";
import { Namer } from "utils/formatting";
import { makeOnEditAutomationConditions } from "./helpers";
import { ModalState, TriggerMakerOptions } from "./types";
import { makeSequenceUpdater, SequenceUpdater } from "./updater";

export type DagFlowUpdateBaseArgs = {
  trigger: AutomationTrigger[];
  condition: AutomationCondition[];
  sequence: AutomationSequenceNode[];
  onTriggerUpdate: (t: AutomationTrigger[]) => void;
  onSequenceUpdate: (s: AutomationSequenceNode[]) => void;
  onConditionUpdate: (s: AutomationCondition[]) => void;
};
export type DagFlowUpdateArgs = DagFlowUpdateBaseArgs & {
  openModal: (m: ModalState) => void;
};

export type DagFlowUpdate = ReturnType<typeof makeDagFlowUpdate>;
export const makeDagFlowUpdate = (args: DagFlowUpdateArgs) => {
  const methods = {
    addNode(
      afterIndex: number | null,
      nodeType: "sequence" | "trigger" | "only-conditions"
    ) {
      return args.openModal({
        saveBtnCreateText: true,
        node:
          nodeType === "sequence"
            ? {
                device_id: "",
              }
            : nodeType === "trigger"
            ? {
                id: "",
              }
            : {
                condition: "and",
                conditions: [],
              },
        update: (n) => {
          console.log({ afterIndex, n });
          if (afterIndex !== null) {
            args.onSequenceUpdate([
              ...args.sequence.slice(0, afterIndex),
              n,
              ...args.sequence.slice(afterIndex),
            ]);
          } else {
            args.onSequenceUpdate([...args.sequence, n]);
          }
        },
        allowedTypes:
          nodeType === "sequence"
            ? ["action", "condition"]
            : nodeType === "trigger"
            ? ["trigger"]
            : ["condition"],
      });
    },
    onEditAutomationConditions() {
      return makeOnEditAutomationConditions(
        args.condition,
        args.onConditionUpdate,
        args.openModal
      )();
    },
    makeTriggerMakerOptions(namer: Namer): TriggerMakerOptions {
      return {
        namer,
        onAdd: () =>
          args.openModal({
            saveBtnCreateText: true,
            node: {
              platform: "device",
            },
            update: (n) => {
              args.onTriggerUpdate([...args.trigger, n]);
            },
            allowedTypes: ["trigger"],
          }),
        onDelete: (i) =>
          args.onTriggerUpdate([
            ...args.trigger.slice(0, i),
            ...args.trigger.slice(i + 1),
          ]),
        onEdit: (i) =>
          args.openModal({
            node: args.trigger[i],
            update: (t) =>
              args.onTriggerUpdate([
                ...args.trigger.slice(0, i),
                t,
                ...args.trigger.slice(i + 1),
              ]),
            allowedTypes: ["trigger"],
          }),
        onSetEnabled: (i) =>
          args.onTriggerUpdate([
            ...args.trigger.slice(0, i),
            { ...args.trigger[i], enabled: !(args.trigger[i].enabled ?? true) },
            ...args.trigger.slice(i + 1),
          ]),
      };
    },
    get sequenceUpdater(): SequenceUpdater {
      return makeSequenceUpdater(
        args.sequence,
        args.onSequenceUpdate,
        args.openModal
      );
    },
  };
  return methods;
};
