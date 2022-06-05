import { DAGAutomationFlowDims } from "components/DAGFlow/types";

export const NODE_WIDTH = 150 as const;
export const NODE_HEIGHT = 60 as const;
export const CONDITION_HEIGHT = 30 as const;
export const CONDITION_WIDTH = 120 as const;
export const CIRCLE_SIZE = 40 as const;
export const DISTANCE_FACTOR = 1.5 as const;
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
  flipped: false,
} as DAGAutomationFlowDims