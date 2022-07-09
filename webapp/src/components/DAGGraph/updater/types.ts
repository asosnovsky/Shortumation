import { AutomationActionData, AutomationNode } from "types/automations";
import { ModalState } from "../board/types";

export type DAGUpdaterInput<N extends AutomationNode> = {
  data: N[];
  onUpdate: (d: N[]) => void;
};
export type DAGUpdaterArgs<K extends keyof AutomationActionData> = Record<
  K,
  DAGUpdaterInput<AutomationActionData[K][0]>
> & {
  openModal: (m: ModalState) => void;
};
