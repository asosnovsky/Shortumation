import { DAGDims } from "./types";

export const NODE_WIDTH = 170 as const;
export const NODE_HEIGHT = 70 as const;
export const CONDITION_HEIGHT = 90 as const;
export const CONDITION_WIDTH = 200 as const;
export const CIRCLE_SIZE = 40 as const;
export const DISTANCE_FACTOR = 1.25 as const;

export const DEFAULT_DIMS = {
  node: {
    height: NODE_HEIGHT,
    width: NODE_WIDTH,
  },
  condition: {
    height: CONDITION_HEIGHT,
    width: CONDITION_WIDTH,
  },
  circle: {
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
  },
  distanceFactor: DISTANCE_FACTOR,
  position: {
    x: 50,
    y: 50,
  },
  flipped: true,
} as DAGDims;
