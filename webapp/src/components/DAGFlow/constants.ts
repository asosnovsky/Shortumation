import { DAGAutomationFlowDims } from "components/DAGFlow/types";

export const NODE_WIDTH = 170 as const;
export const NODE_HEIGHT = 70 as const;
export const CONDITION_HEIGHT = 90 as const;
export const CONDITION_WIDTH = 200 as const;
export const CIRCLE_SIZE = 40 as const;
export const DISTANCE_FACTOR = 1.75 as const;
export const PADDING = 50 as const;

export const DEFAULT_DIMS = {
  nodeHeight: NODE_HEIGHT,
  nodeWidth: NODE_WIDTH,
  conditionHeight: CONDITION_HEIGHT,
  conditionWidth: CONDITION_WIDTH,
  distanceFactor: DISTANCE_FACTOR,
  circleSize: CIRCLE_SIZE,
  padding: {
    x: PADDING,
    y: PADDING,
  },
  flipped: true,
} as DAGAutomationFlowDims;
