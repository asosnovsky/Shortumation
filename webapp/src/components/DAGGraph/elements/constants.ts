import { DAGDims } from "./types";

export const NODE_WIDTH = 170 as const;
export const NODE_HEIGHT = 70 as const;
export const CIRCLE_SIZE = 40 as const;
export const DISTANCE_FACTOR = 1.25 as const;

export const DEFAULT_DIMS: DAGDims = {
  trigger: {
    height: NODE_HEIGHT * 3,
    width: NODE_WIDTH * 4.5,
  },
  node: {
    height: NODE_HEIGHT,
    width: NODE_WIDTH,
  },
  condition: {
    height: NODE_HEIGHT * 3,
    width: NODE_WIDTH * 4.5,
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
};
