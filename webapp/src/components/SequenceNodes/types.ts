import { AutomationSequenceNode } from "types/automations";
import { Point } from "types/graphs";

export interface SequenceNodeSettings extends BaseSequenceNodeSettings{
  sequence: AutomationSequenceNode[],
  onChange?: (s: AutomationSequenceNode[]) => void;
}

export interface BaseSequenceNodeSettings {
  startPoint: Point;
  nodeHeight: number;
  nodeWidth: number;
  distanceFactor: number;
  edgeColor: string;
  keyPrefix?: string;
}
