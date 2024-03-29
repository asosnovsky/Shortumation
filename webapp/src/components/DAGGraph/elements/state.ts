import { useState } from "react";
import { AutomationNode } from "types/automations";
import { isSpecialNode } from "./specialnodes";
import { getNodeSubType } from "utils/automations";

export type DAGNodeState = Partial<{
  isClosed: boolean;
}>;
export type DAGElementsState = ReturnType<typeof useDAGElementsState>;
export const useDAGElementsState = () => {
  const [data, setData] = useState<Record<string, DAGNodeState>>({});
  return {
    get(nodeId: string): DAGNodeState {
      return data[nodeId] ?? {};
    },

    set<K extends keyof DAGNodeState>(
      nodeId: string,
      key: K,
      value: DAGNodeState[K]
    ) {
      setData({
        ...data,
        [nodeId]: {
          ...(data[nodeId] ?? {}),
          [key]: value,
        },
      });
    },

    getIsClosedActions(nodeId: string, node: AutomationNode) {
      if (isSpecialNode(getNodeSubType(node, true))) {
        return {
          isClosed: this.get(nodeId).isClosed ?? false,
          setIsClosed: (v: boolean) => this.set(nodeId, "isClosed", v),
        };
      }
      return {};
    },
  };
};
