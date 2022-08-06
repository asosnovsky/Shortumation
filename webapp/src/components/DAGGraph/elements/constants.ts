import { DAGDims } from "./types";

export const NODE_WIDTH = 200 as const;
export const NODE_HEIGHT = 80 as const;

export const DEFAULT_DIMS: DAGDims = {
  collection: {
    height: NODE_HEIGHT * 3,
    width: NODE_WIDTH * 2.5,
  },
  node: {
    height: NODE_HEIGHT,
    width: NODE_WIDTH,
  },
  distanceFactor: {
    node: [1.5, 1.5],
    collection: [1.2, 1.1],
  },
  position: {
    x: 50,
    y: 50,
  },
  flipped: true,
};
