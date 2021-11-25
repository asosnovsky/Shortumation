import { AutomationSequenceNode } from "types/automations";
import { Point } from "types/graphs";

export type SequenceNodeSettings = {
  startPoint: Point,
  sequence: AutomationSequenceNode[],
  nodeHeight: number,
  nodeWidth: number,
  distanceFactor: number,
  edgeColor: string,
  keyPrefix?: string,
  onChange?: (s: AutomationSequenceNode[]) => void;
}
