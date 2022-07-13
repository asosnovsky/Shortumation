import { useState } from "react";
import { AutomationNode } from "types/automations";

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
      if ("choose" in node || "repeat" in node) {
        return {
          isClosed: this.get(nodeId).isClosed ?? false,
          setIsClosed: (v: boolean) => this.set(nodeId, "isClosed", v),
        };
      }
      return {};
    },
  };
};
